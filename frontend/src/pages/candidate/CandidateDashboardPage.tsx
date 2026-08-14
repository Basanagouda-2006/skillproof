import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, FileCheck2, TrendingUp, AlertCircle } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { SkillEvidence, Repository } from '../../types';

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState<SkillEvidence[] | null>(null);
  const [repos, setRepos] = useState<Repository[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [{ evidence }, { repositories }] = await Promise.all([
          unwrap<{ evidence: SkillEvidence[] }>(api.get('/evidence')),
          unwrap<{ repositories: Repository[] }>(api.get('/repositories')),
        ]);
        setEvidence(evidence);
        setRepos(repositories);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  const withEvidence = evidence?.filter((e) => e.evidenceLevel !== 'NO_EVIDENCE') ?? [];
  const strong = evidence?.filter((e) => e.evidenceLevel === 'STRONG').length ?? 0;
  const moderate = evidence?.filter((e) => e.evidenceLevel === 'MODERATE').length ?? 0;
  const gaps = evidence?.filter((e) => e.evidenceLevel === 'NO_EVIDENCE').length ?? 0;

  const profileFieldsFilled = [
    user?.profile.bio, user?.profile.location, user?.profile.linkedin, user?.githubUsername,
  ].filter(Boolean).length;
  const completeness = Math.round((profileFieldsFilled / 4) * 100);

  if (!user?.githubUsername) {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-semibold font-display">Welcome, {user?.name.split(' ')[0]}</h1>
        <div className="mt-6">
          <EmptyState
            title="Connect GitHub to get started"
            description="SkillProof generates evidence from your real repositories. Connect a GitHub username to analyze your work and see your first evidence results."
            action={<Link to="/candidate/github" className="btn-primary">Connect GitHub</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Welcome back, {user?.name.split(' ')[0]}</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={Github} label="Repositories analyzed" value={repos?.length ?? 0} />
        <StatCard icon={FileCheck2} label="Strong evidence" value={strong} accent="text-evidence-strong" />
        <StatCard icon={TrendingUp} label="Moderate evidence" value={moderate} accent="text-evidence-moderate" />
        <StatCard icon={AlertCircle} label="Evidence gaps" value={gaps} accent="text-evidence-weak" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <p className="font-medium text-slate-900">Profile completeness</p>
          <div className="w-full h-2 rounded-full bg-slate-100 mt-3">
            <div className="h-2 rounded-full bg-brand-blue" style={{ width: `${completeness}%` }} />
          </div>
          <p className="text-sm text-slate-500 mt-2">{completeness}% complete</p>
          <Link to="/candidate/profile" className="text-sm text-brand-blue font-medium mt-3 inline-block hover:underline">
            Complete your profile
          </Link>
        </div>

        <div className="card p-6">
          <p className="font-medium text-slate-900">Skills with evidence</p>
          {withEvidence.length === 0 ? (
            <p className="text-sm text-slate-500 mt-2">No skills with evidence yet. Analyze more repositories to build evidence.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {withEvidence.slice(0, 5).map((e) => (
                <li key={e._id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{e.skill}</span>
                  <span className="text-xs font-mono text-slate-500">{e.evidenceLevel}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/candidate/evidence" className="text-sm text-brand-blue font-medium mt-3 inline-block hover:underline">
            View all evidence
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent?: string }) {
  return (
    <div className="card p-5">
      <Icon size={18} className={accent || 'text-brand-blue'} />
      <p className="text-2xl font-semibold font-display mt-2">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
