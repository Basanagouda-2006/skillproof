import { useEffect, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { Repository } from '../../types';
import { Link } from 'react-router-dom';

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap<{ repositories: Repository[] }>(api.get('/repositories'))
      .then((r) => setRepos(r.repositories as any))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading repositories..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  if (!repos || repos.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No repositories analyzed yet"
          description="Connect your GitHub account to analyze your public repositories."
          action={<Link to="/candidate/github" className="btn-primary">Connect GitHub</Link>}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Repositories</h1>
      <p className="text-slate-500 text-sm mt-1">{repos.length} repositories analyzed</p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {repos.map((repo) => (
          <div key={repo._id} className="card p-5">
            <div className="flex items-start justify-between">
              <p className="font-medium text-slate-900">{repo.name}</p>
              <a href={repo.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-blue">
                <ExternalLink size={15} />
              </a>
            </div>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{repo.description || 'No description provided.'}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {repo.languages.map((l) => (
                <span key={l} className="text-xs font-mono bg-slate-100 text-slate-600 rounded px-2 py-0.5">{l}</span>
              ))}
              {repo.detectedTechnologies.slice(0, 4).map((t) => (
                <span key={t} className="text-xs font-mono bg-brand-blue/10 text-brand-blue rounded px-2 py-0.5">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-1"><Star size={12} /> {repo.stargazersCount}</span>
              <span>Updated {new Date(repo.repoUpdatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
