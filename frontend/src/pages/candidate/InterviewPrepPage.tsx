import { useEffect, useState } from 'react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EvidenceBadge from '../../components/evidence/EvidenceBadge';
import type { SkillEvidence } from '../../types';

export default function InterviewPrepPage() {
  const [evidence, setEvidence] = useState<SkillEvidence[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap<{ evidence: SkillEvidence[] }>(api.get('/evidence'))
      .then((r) => setEvidence(r.evidence))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  const strong = evidence?.filter((e) => e.evidenceLevel === 'STRONG') ?? [];
  const weak = evidence?.filter((e) => ['WEAK', 'NO_EVIDENCE'].includes(e.evidenceLevel)) ?? [];

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold font-display">Interview preparation</h1>
      <p className="text-slate-600 text-sm mt-2">
        Be ready to explain the same evidence a recruiter would see. Strong-evidence skills are
        likely to come up as "explain your work" questions; weak-evidence skills are likely to
        come up as "how would you approach this" questions.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Be ready to explain</h2>
        <div className="mt-3 space-y-2">
          {strong.length === 0 && <p className="text-sm text-slate-500">No strong-evidence skills yet.</p>}
          {strong.map((e) => (
            <div key={e._id} className="card p-4 flex items-center justify-between">
              <span className="text-sm text-slate-900">{e.skill}</span>
              <EvidenceBadge level={e.evidenceLevel} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Be ready to address gaps</h2>
        <div className="mt-3 space-y-2">
          {weak.length === 0 && <p className="text-sm text-slate-500">No evidence gaps found.</p>}
          {weak.map((e) => (
            <div key={e._id} className="card p-4 flex items-center justify-between">
              <span className="text-sm text-slate-900">{e.skill}</span>
              <EvidenceBadge level={e.evidenceLevel} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
