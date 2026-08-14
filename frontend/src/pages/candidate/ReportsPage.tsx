import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import type { EvidenceReport } from '../../types';

export default function ReportsPage() {
  const [reports, setReports] = useState<EvidenceReport[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  async function load() {
    try {
      const r = await unwrap<{ reports: EvidenceReport[] }>(api.get('/reports'));
      setReports(r.reports);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleGenerate() {
    setError('');
    setGenerating(true);
    try {
      await unwrap(api.post('/reports/generate'));
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <LoadingState label="Loading reports..." />;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-display">Reports</h1>
        <button onClick={handleGenerate} disabled={generating} className="btn-primary disabled:opacity-60">
          {generating ? 'Generating...' : 'Generate report'}
        </button>
      </div>

      {error && <div className="mt-4"><ErrorState message={error} /></div>}

      {!reports || reports.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No reports yet"
            description="Generate your first evidence report to get a snapshot of your verified skills."
          />
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {reports.map((report) => (
            <div key={report._id} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">{new Date(report.createdAt).toLocaleString()}</p>
                {!report.aiAvailable && (
                  <span className="text-xs text-slate-400 italic">AI explanation unavailable</span>
                )}
              </div>
              <p className="text-sm text-slate-900 mt-2">{report.summary}</p>
              {report.aiExplanation && (
                <div className="mt-3 flex items-start gap-2 bg-brand-blue/5 rounded-md p-3">
                  <Sparkles size={14} className="text-brand-blue shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{report.aiExplanation}</p>
                </div>
              )}
              <ul className="mt-3 grid sm:grid-cols-2 gap-1.5">
                {report.skills.map((s) => (
                  <li key={s.skill} className="text-xs text-slate-600 flex justify-between border-b border-slate-50 py-1">
                    <span>{s.skill}</span>
                    <span className="font-mono">{s.evidenceLevel}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
