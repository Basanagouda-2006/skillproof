import { useEffect, useState } from 'react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { Job } from '../../types';

export default function JobMatchesPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap<{ jobs: Job[] }>(api.get('/jobs/active'))
      .then((r) => setJobs(r.jobs))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading open roles..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  if (!jobs || jobs.length === 0) {
    return (
      <div className="p-8">
        <EmptyState title="No active job postings" description="Check back later for open roles from recruiters." />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Job matches</h1>
      <p className="text-slate-500 text-sm mt-1">
        Active job postings. Recruiters compute your match using your evidence, not your resume alone.
      </p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {jobs.map((job) => (
          <div key={job._id} className="card p-5">
            <p className="font-medium text-slate-900">{job.title}</p>
            <p className="text-sm text-slate-500">{job.companyName} · {job.location || 'Remote'}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.requiredSkills.map((s) => (
                <span key={s} className="text-xs font-mono bg-slate-100 text-slate-600 rounded px-2 py-0.5">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
