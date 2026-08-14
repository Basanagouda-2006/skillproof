import { useEffect, useState } from 'react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import type { Job, User, EvidenceLevel } from '../../types';

interface CompareResult {
  candidate: User;
  matchedSkills: { skill: string; evidenceLevel: EvidenceLevel }[];
  missingSkills: string[];
  matchScore: number;
  evidenceSummary: string;
}

export default function ComparePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [results, setResults] = useState<CompareResult[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

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

  function toggleCandidate(id: string) {
    setSelectedCandidates((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleCompare() {
    if (!selectedJob || selectedCandidates.length === 0) return;
    setError('');
    setComparing(true);
    try {
      const { results } = await unwrap<{ results: CompareResult[] }>(
        api.post('/matches/compare', { jobId: selectedJob, candidateIds: selectedCandidates })
      );
      setResults(results);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setComparing(false);
    }
  }

  if (loading) return <LoadingState label="Loading..." />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Compare candidates</h1>

      {error && <div className="mt-4"><ErrorState message={error} /></div>}

      <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-3xl">
        <div>
          <label className="text-sm font-medium text-slate-700">Job</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select a job</option>
            {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Candidates</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {candidates.map((c) => (
              <button
                key={c._id}
                onClick={() => toggleCandidate(c._id)}
                className={`rounded-full px-3 py-1.5 text-sm border ${
                  selectedCandidates.includes(c._id) ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-slate-300 text-slate-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleCompare} disabled={comparing || !selectedJob || selectedCandidates.length === 0} className="btn-primary mt-6 disabled:opacity-60">
        {comparing ? 'Comparing...' : 'Compare'}
      </button>

      {results && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-slate-200">
                <th className="py-2 pr-4 font-medium text-slate-700">Candidate</th>
                <th className="py-2 pr-4 font-medium text-slate-700">Match score</th>
                <th className="py-2 pr-4 font-medium text-slate-700">Matched skills</th>
                <th className="py-2 pr-4 font-medium text-slate-700">Missing skills</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.candidate._id} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-4 font-medium text-slate-900">{r.candidate.name}</td>
                  <td className="py-3 pr-4 font-mono">{r.matchScore}%</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {r.matchedSkills.map((s) => (
                        <span key={s.skill} title={s.evidenceLevel} className="text-xs bg-evidence-strong/10 text-evidence-strong rounded px-2 py-0.5">{s.skill}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {r.missingSkills.map((s) => (
                        <span key={s} className="text-xs bg-evidence-weak/10 text-evidence-weak rounded px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">
            Match score = (earned points / max possible points) × 100, where required skills weigh more than preferred skills
            and each skill's contribution scales with its evidence level (Strong &gt; Moderate &gt; Weak &gt; None).
          </p>
        </div>
      )}
    </div>
  );
}
