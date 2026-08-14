import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EvidenceBadge from '../../components/evidence/EvidenceBadge';
import type { Job, User, SkillEvidence } from '../../types';

interface InterviewPack {
  job: { title: string; companyName: string };
  strongEvidence: SkillEvidence[];
  moderateEvidence: SkillEvidence[];
  weakOrNoEvidence: SkillEvidence[];
  aiQuestionsAvailable: boolean;
  questions: { skill: string; question: string }[];
}

export default function InterviewPacksPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [jobId, setJobId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [pack, setPack] = useState<InterviewPack | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      unwrap<{ jobs: Job[] }>(api.get('/jobs/mine')),
      unwrap<{ candidates: User[] }>(api.get('/candidates')),
    ])
      .then(([j, c]) => {
        setJobs(j.jobs);
        setCandidates(c.candidates);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    if (!jobId || !candidateId) return;
    setError('');
    setGenerating(true);
    try {
      const result = await unwrap<InterviewPack>(api.get(`/matches/interview-pack/${jobId}/${candidateId}`));
      setPack(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <LoadingState label="Loading..." />;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold font-display">Interview evidence packs</h1>
      <p className="text-slate-600 text-sm mt-2">
        Evidence-grounded interview material for a specific candidate and job.
      </p>

      {error && <div className="mt-4"><ErrorState message={error} /></div>}

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select a job</option>
          {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
        <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select a candidate</option>
          {candidates.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <button onClick={handleGenerate} disabled={generating || !jobId || !candidateId} className="btn-primary mt-4 disabled:opacity-60">
        {generating ? 'Generating...' : 'Generate interview pack'}
      </button>

      {pack && (
        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold">{pack.job.title} · {pack.job.companyName}</h2>
          </div>

          <EvidenceGroup title="Strong evidence" items={pack.strongEvidence} />
          <EvidenceGroup title="Moderate evidence" items={pack.moderateEvidence} />
          <EvidenceGroup title="Weak / no evidence" items={pack.weakOrNoEvidence} />

          <section>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium uppercase tracking-wide text-slate-900">Evidence-grounded questions</h3>
              {!pack.aiQuestionsAvailable && <span className="text-xs text-slate-400 italic">AI unavailable — showing evidence only</span>}
            </div>
            {pack.questions.length === 0 ? (
              <p className="text-sm text-slate-500 mt-3">
                {pack.aiQuestionsAvailable
                  ? 'No questions generated.'
                  : 'AI question generation is unavailable. Use the evidence breakdown above to form your own questions: ask for strong-evidence skills to be explained, and ask weak-evidence skills how the candidate would approach learning or applying them.'}
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {pack.questions.map((q, i) => (
                  <li key={i} className="card p-4 flex items-start gap-2">
                    <Sparkles size={14} className="text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono text-slate-500">{q.skill}</p>
                      <p className="text-sm text-slate-900 mt-0.5">{q.question}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function EvidenceGroup({ title, items }: { title: string; items: SkillEvidence[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="text-sm font-medium uppercase tracking-wide text-slate-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((e) => (
          <div key={e._id} className="card p-4 flex items-center justify-between">
            <span className="text-sm text-slate-900">{e.skill}</span>
            <EvidenceBadge level={e.evidenceLevel} />
          </div>
        ))}
      </div>
    </section>
  );
}
