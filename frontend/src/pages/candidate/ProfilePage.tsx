import { useState } from 'react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/ui/ErrorState';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.profile.bio || '',
    location: user?.profile.location || '',
    linkedin: user?.profile.linkedin || '',
    portfolio: user?.profile.portfolio || '',
    resumeLink: user?.profile.resumeLink || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await unwrap(
        api.put('/users/me', {
          name: form.name,
          profile: {
            bio: form.bio,
            location: form.location,
            linkedin: form.linkedin,
            portfolio: form.portfolio,
            resumeLink: form.resumeLink,
          },
        })
      );
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof typeof form, label: string, type = 'text') => (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
      />
    </div>
  );

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold font-display">Profile</h1>
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {success && <div className="card p-3 mt-4 border-evidence-strong/30 bg-evidence-strong/5 text-sm text-slate-900">Profile updated.</div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {field('name', 'Name')}
        <div>
          <label className="text-sm font-medium text-slate-700">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            maxLength={500}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
          />
        </div>
        {field('location', 'Location')}
        {field('linkedin', 'LinkedIn URL', 'url')}
        {field('portfolio', 'Portfolio URL', 'url')}
        {field('resumeLink', 'Resume link', 'url')}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
