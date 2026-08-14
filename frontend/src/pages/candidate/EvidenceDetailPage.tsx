import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EvidenceBadge from '../../components/evidence/EvidenceBadge';
import EvidenceTrace from '../../components/evidence/EvidenceTrace';
import type { SkillEvidence, Repository } from '../../types';

export default function EvidenceDetailPage() {
  const { skill } = useParams();
  const [evidence, setEvidence] = useState<SkillEvidence | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skill) return;
    unwrap<{ evidence: SkillEvidence }>(api.get(`/evidence/${encodeURIComponent(skill)}`))
      .then((r) => setEvidence(r.evidence))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [skill]);

  if (loading) return <LoadingState label="Loading evidence..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (!evidence) return null;

  const repos = evidence.repositoryReferences as Repository[];

  return (
    <div className="p-8 max-w-2xl">
      <Link to="/candidate/evidence" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={14} /> Back to evidence
      </Link>

      <div className="flex items-center justify-between mt-4">
        <h1 className="text-2xl font-semibold font-display">{evidence.skill}</h1>
        <EvidenceBadge level={evidence.evidenceLevel} />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wide">Evidence trace</h2>
        <div className="mt-4">
          <EvidenceTrace items={evidence.evidenceItems} />
        </div>
      </section>

      {repos.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wide">Repositories</h2>
          <ul className="mt-3 space-y-2">
            {repos.map((r) => (
              <li key={r._id}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-brand-blue text-sm hover:underline">
                  {r.owner}/{r.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evidence.strengths.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wide">Strengths</h2>
          <ul className="mt-3 space-y-1.5">
            {evidence.strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-700">• {s}</li>
            ))}
          </ul>
        </section>
      )}

      {evidence.gaps.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wide">Gaps</h2>
          <ul className="mt-3 space-y-1.5">
            {evidence.gaps.map((g, i) => (
              <li key={i} className="text-sm text-slate-700">• {g}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 card p-4 bg-slate-50 border-slate-200">
        <p className="text-xs text-slate-500">{evidence.limitations}</p>
      </section>
    </div>
  );
}
