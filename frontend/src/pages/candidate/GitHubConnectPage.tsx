import { useEffect, useState } from 'react';
import { Github, CheckCircle2 } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/ui/ErrorState';

export default function GitHubConnectPage() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.githubUsername || '');
  const [status, setStatus] = useState<{ connected: boolean; repositoriesAnalyzed: number } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    unwrap<{ connected: boolean; repositoriesAnalyzed: number }>(api.get('/github/status'))
      .then(setStatus)
      .catch(() => {});
  }, []);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const result = await unwrap<{ repositories: any[]; message?: string }>(
        api.post('/github/connect', { githubUsername: username })
      );
      await refreshUser();
      setSuccess(
        result.message || `Analyzed ${result.repositories.length} repositories and generated evidence.`
      );
      const newStatus = await unwrap<{ connected: boolean; repositoriesAnalyzed: number }>(
        api.get('/github/status')
      );
      setStatus(newStatus);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold font-display flex items-center gap-2">
        <Github size={22} /> GitHub
      </h1>
      <p className="text-slate-600 mt-2 text-sm">
        Connect a public GitHub account. SkillProof analyzes real, non-fork repositories -
        languages, dependencies, topics, and README content - to generate evidence.
      </p>

      {status?.connected && (
        <div className="card p-4 mt-6 flex items-center gap-3 border-evidence-strong/30 bg-evidence-strong/5">
          <CheckCircle2 className="text-evidence-strong" size={18} />
          <p className="text-sm text-slate-900">
            Connected as <strong>{user?.githubUsername}</strong> · {status.repositoriesAnalyzed} repositories analyzed
          </p>
        </div>
      )}

      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {success && (
        <div className="card p-4 mt-4 border-brand-blue/30 bg-brand-blue/5">
          <p className="text-sm text-slate-900">{success}</p>
        </div>
      )}

      <form onSubmit={handleConnect} className="mt-6 flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
          required
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
        />
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Analyzing...' : status?.connected ? 'Re-analyze' : 'Connect'}
        </button>
      </form>
    </div>
  );
}
