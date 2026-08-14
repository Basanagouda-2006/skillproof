import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../services/api';
import ErrorState from '../../components/ui/ErrorState';
import type { Role } from '../../types';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'candidate' as Role,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate(form.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold font-display text-center">Create your account</h1>
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'candidate' })}
            className={`rounded-md border px-3 py-2 text-sm font-medium ${form.role === 'candidate' ? 'border-brand-blue text-brand-blue bg-brand-blue/5' : 'border-slate-300 text-slate-600'}`}
          >
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'recruiter' })}
            className={`rounded-md border px-3 py-2 text-sm font-medium ${form.role === 'recruiter' ? 'border-brand-blue text-brand-blue bg-brand-blue/5' : 'border-slate-300 text-slate-600'}`}
          >
            Recruiter
          </button>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          <p className="text-xs text-slate-400 mt-1">At least 8 characters, one uppercase letter, one number.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Confirm password</label>
          <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-slate-500 text-center mt-6">
        Already have an account? <Link to="/login" className="text-brand-blue font-medium">Log in</Link>
      </p>
    </div>
  );
}
