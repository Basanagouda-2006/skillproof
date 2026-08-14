import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, AlertCircle } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { Job } from '../../types';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap<{ jobs: Job[] }>(api.get('/jobs/mine'))
      .then((r) => setJobs(r.jobs))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;

  const active = jobs?.filter((j) => j.status === 'active').length ?? 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold font-display">Welcome back, {user?.name.split(' ')[0]}</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={Briefcase} label="Active jobs" value={active} />
        <StatCard icon={Users} label="Total jobs posted" value={jobs?.length ?? 0} />
        <StatCard icon={Star} label="Shortlisted" value={0} accent="text-evidence-strong" />
        <StatCard icon={AlertCircle} label="Needs review" value={0} accent="text-evidence-weak" />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-slate-900">Recent jobs</h2>
          <Link to="/recruiter/jobs" className="text-sm text-brand-blue font-medium hover:underline">Manage jobs</Link>
        </div>
        {!jobs || jobs.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No jobs posted yet"
              description="Create your first job posting to start matching candidates against your requirements."
              action={<Link to="/recruiter/jobs" className="btn-primary">Create a job</Link>}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {jobs.slice(0, 4).map((job) => (
              <div key={job._id} className="card p-5">
                <p className="font-medium text-slate-900">{job.title}</p>
                <p className="text-sm text-slate-500">{job.companyName}</p>
              </div>
            ))}
          </div>
        )}
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
