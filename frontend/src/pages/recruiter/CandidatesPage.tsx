import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { User } from '../../types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<User[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap<{ candidates: User[] }>(api.get('/candidates'))
      .then((r) => setCandidates(r.candidates))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading candidates..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  if (!candidates || candidates.length === 0) {
    return <div className="p-8"><EmptyState title="No candidates yet" description="Candidates will appear here once they register." /></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Candidates</h1>
      <div className="mt-6 divide-y divide-slate-100 card">
        {candidates.map((c) => (
          <Link key={c._id} to={`/recruiter/candidates/${c._id}`} className="flex items-center justify-between px-5 py-4 hover:bg-surface-off">
            <div>
              <p className="font-medium text-slate-900">{c.name}</p>
              <p className="text-sm text-slate-500">{c.githubUsername ? `GitHub: ${c.githubUsername}` : 'GitHub not connected'}</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-end max-w-xs">
              {c.claimedSkills.slice(0, 4).map((s) => (
                <span key={s} className="text-xs font-mono bg-slate-100 text-slate-600 rounded px-2 py-0.5">{s}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
