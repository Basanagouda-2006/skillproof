import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import EvidenceBadge from '../../components/evidence/EvidenceBadge';
import type { SkillEvidence } from '../../types';

const ORDER = { STRONG: 0, MODERATE: 1, WEAK: 2, NO_EVIDENCE: 3 };

export default function EvidenceListPage() {
  const [evidence, setEvidence] = useState<SkillEvidence[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap<{ evidence: SkillEvidence[] }>(api.get('/evidence'))
      .then((r) => setEvidence(r.evidence))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading evidence..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  if (!evidence || evidence.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No evidence yet"
          description="Connect GitHub to generate evidence for your claimed skills."
          action={<Link to="/candidate/github" className="btn-primary">Connect GitHub</Link>}
        />
      </div>
    );
  }

  const sorted = [...evidence].sort((a, b) => ORDER[a.evidenceLevel] - ORDER[b.evidenceLevel]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Evidence</h1>
      <p className="text-slate-500 text-sm mt-1">
        Every evidence level is traceable to specific repositories. Click a skill to inspect it.
      </p>

      <div className="mt-6 divide-y divide-slate-100 card">
        {sorted.map((e) => (
          <Link
            key={e._id}
            to={`/candidate/evidence/${encodeURIComponent(e.skill)}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-surface-off transition-colors"
          >
            <div>
              <p className="font-medium text-slate-900">{e.skill}</p>
              <p className="text-xs text-slate-500 mt-0.5">{e.evidenceItems.length} evidence item(s)</p>
            </div>
            <EvidenceBadge level={e.evidenceLevel} />
          </Link>
        ))}
      </div>
    </div>
  );
}
