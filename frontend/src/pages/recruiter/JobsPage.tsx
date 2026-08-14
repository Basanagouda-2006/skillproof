import { useEffect, useState } from 'react';
import { Plus, Trash2, Power } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { Job } from '../../types';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'internship', 'contract'];
const EXPERIENCE_LEVELS = ['entry', 'junior', 'mid', 'senior'];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', companyName: '', description: '', location: '',
    employmentType: 'full-time', experienceLevel: 'entry',
  });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const r = await unwrap<{ jobs: Job[] }>(api.get('/jobs/mine'));
      setJobs(r.jobs);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await unwrap(api.post('/jobs', form));
      setForm({ title: '', companyName: '', description: '', location: '', employmentType: 'full-time', experienceLevel: 'entry' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(job: Job) {
    try {
      await unwrap(api.put(`/jobs/${job._id}`, { status: job.status === 'active' ? 'inactive' : 'active' }));
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    try {
      await unwrap(api.delete(`/jobs/${id}`));
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  if (loading) return <LoadingState label="Loading jobs..." />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-display">Jobs</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={16} /> New job
        </button>
      </div>

      {error && <div className="mt-4"><ErrorState message={error} /></div>}

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mt-6 max-w-xl space-y-3">
          <input required placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          <input required placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          <textarea required rows={4} placeholder="Job description (technical skills mentioned here are auto-detected)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              {EXPERIENCE_LEVELS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? 'Creating...' : 'Create job'}
          </button>
        </form>
      )}

      {!jobs || jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No jobs posted yet" description="Create your first job posting to start matching candidates." />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {jobs.map((job) => (
            <div key={job._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{job.title}</p>
                  <p className="text-sm text-slate-500">{job.companyName} · {job.location || 'Remote'}</p>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${job.status === 'active' ? 'bg-evidence-strong/10 text-evidence-strong' : 'bg-slate-100 text-slate-500'}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.requiredSkills.map((s) => (
                  <span key={s} className="text-xs font-mono bg-slate-100 text-slate-600 rounded px-2 py-0.5">{s}</span>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => toggleStatus(job)} className="text-sm text-slate-500 hover:text-brand-blue flex items-center gap-1">
                  <Power size={14} /> {job.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(job._id)} className="text-sm text-slate-500 hover:text-evidence-weak flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
