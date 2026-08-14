import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EvidenceBadge from '../../components/evidence/EvidenceBadge';
import type { SkillEvidence, Repository } from '../../types';

interface PublicProfile {
  name: string;
  bio: string;
  linkedin: string;
  portfolio: string;
  githubUsername: string;
  evidence: SkillEvidence[];
  repositories: Repository[];
}

export default function PublicProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    unwrap<{ profile: PublicProfile }>(api.get(`/share/public/${slug}`))
      .then((r) => setProfile(r.profile))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState label="Loading profile..." />;
  if (error) return <div className="max-w-2xl mx-auto px-6 py-16"><ErrorState message={error} /></div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">{profile.name}</h1>
      {profile.bio && <p className="text-slate-600 mt-3">{profile.bio}</p>}
      <div className="flex gap-4 mt-3 text-sm">
        {profile.githubUsername && (
          <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
            GitHub
          </a>
        )}
        {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">LinkedIn</a>}
        {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">Portfolio</a>}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Evidence</h2>
        <div className="mt-4 space-y-3">
          {profile.evidence.map((e) => (
            <div key={e._id} className="card p-4 flex items-center justify-between">
              <span className="text-sm text-slate-900">{e.skill}</span>
              <EvidenceBadge level={e.evidenceLevel} />
            </div>
          ))}
        </div>
      </section>

      {profile.repositories.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Selected repositories</h2>
          <ul className="mt-4 space-y-2">
            {profile.repositories.map((r) => (
              <li key={r._id}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-brand-blue text-sm hover:underline">
                  {r.owner}/{r.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
