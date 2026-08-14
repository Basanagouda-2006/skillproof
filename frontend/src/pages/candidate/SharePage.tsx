import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import type { SkillEvidence, Repository } from '../../types';

interface ShareProfile {
  slug: string;
  enabled: boolean;
  selectedSkills: string[];
  selectedRepositories: string[];
}

export default function SharePage() {
  const [profile, setProfile] = useState<ShareProfile | null>(null);
  const [evidence, setEvidence] = useState<SkillEvidence[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [{ profile }, { evidence }, { repositories }] = await Promise.all([
          unwrap<{ profile: ShareProfile | null }>(api.get('/share/settings')),
          unwrap<{ evidence: SkillEvidence[] }>(api.get('/evidence')),
          unwrap<{ repositories: Repository[] }>(api.get('/repositories')),
        ]);
        setProfile(profile);
        setEvidence(evidence);
        setRepos(repositories as any);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function saveSettings(next: Partial<ShareProfile>) {
    setSaving(true);
    try {
      const { profile: updated } = await unwrap<{ profile: ShareProfile }>(
        api.put('/share/settings', { ...profile, ...next })
      );
      setProfile(updated);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function toggleSkill(skill: string) {
    const current = profile?.selectedSkills || [];
    const next = current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill];
    saveSettings({ selectedSkills: next });
  }

  function toggleRepo(id: string) {
    const current = profile?.selectedRepositories || [];
    const next = current.includes(id) ? current.filter((r) => r !== id) : [...current, id];
    saveSettings({ selectedRepositories: next });
  }

  if (loading) return <LoadingState label="Loading share settings..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  const shareUrl = profile ? `${window.location.origin}/p/${profile.slug}` : '';

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold font-display">Share profile</h1>
      <p className="text-slate-600 text-sm mt-2">
        Choose exactly which skills and repositories appear on your public profile.
        Nothing else about your account is ever shared.
      </p>

      <div className="card p-5 mt-6 flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-900">Public profile</p>
          <p className="text-sm text-slate-500">{profile?.enabled ? 'Visible to anyone with the link' : 'Not visible'}</p>
        </div>
        <button
          onClick={() => saveSettings({ enabled: !profile?.enabled })}
          disabled={saving}
          className={profile?.enabled ? 'btn-secondary' : 'btn-primary'}
        >
          {profile?.enabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      {profile?.enabled && (
        <div className="card p-4 mt-4 flex items-center justify-between gap-2">
          <p className="text-sm font-mono text-slate-700 truncate">{shareUrl}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="text-slate-500 hover:text-brand-blue shrink-0"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Skills to show</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {evidence.map((e) => (
            <button
              key={e._id}
              onClick={() => toggleSkill(e.skill)}
              className={`rounded-full px-3 py-1.5 text-sm border ${
                profile?.selectedSkills.includes(e.skill)
                  ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {e.skill}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Repositories to show</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {repos.map((r) => (
            <button
              key={r._id}
              onClick={() => toggleRepo(r._id)}
              className={`rounded-full px-3 py-1.5 text-sm border ${
                profile?.selectedRepositories.includes(r._id)
                  ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
