import { useState } from 'react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/ui/ErrorState';

export default function RecruiterSettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const [companyName, setCompanyName] = useState(user?.profile.companyName || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCompanySave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await unwrap(api.put('/users/me', { profile: { ...user?.profile, companyName } }));
      await refreshUser();
      setSuccess('Company information updated.');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await unwrap(api.put('/users/me/password', passwords));
      setSuccess('Password updated.');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold font-display">Settings</h1>
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {success && <div className="card p-3 mt-4 border-evidence-strong/30 bg-evidence-strong/5 text-sm">{success}</div>}

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Profile</h2>
        <p className="text-sm text-slate-600 mt-2">{user?.name} · {user?.email}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Company information</h2>
        <form onSubmit={handleCompanySave} className="mt-3 flex gap-2">
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
          />
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">Save</button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Change password</h2>
        <form onSubmit={handlePasswordChange} className="mt-3 space-y-3">
          <input
            type="password" placeholder="Current password" required
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
          />
          <input
            type="password" placeholder="New password" required
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
          />
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">Update password</button>
        </form>
      </section>

      <section className="mt-10 border-t border-slate-100 pt-6">
        <button onClick={logout} className="btn-secondary">Log out</button>
      </section>
    </div>
  );
}
