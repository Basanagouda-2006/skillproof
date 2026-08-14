import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EvidenceBadge from '../../components/evidence/EvidenceBadge';
import type { User, SkillEvidence } from '../../types';

interface Note { _id: string; note: string; createdAt: string }

export default function CandidateDetailPage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<User | null>(null);
  const [evidence, setEvidence] = useState<SkillEvidence[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!id) return;
    try {
      const [{ candidate }, { evidence }, { notes }] = await Promise.all([
        unwrap<{ candidate: User }>(api.get(`/candidates/${id}`)),
        unwrap<{ evidence: SkillEvidence[] }>(api.get(`/evidence/candidate/${id}`)),
        unwrap<{ notes: Note[] }>(api.get(`/notes/candidate/${id}`)),
      ]);
      setCandidate(candidate);
      setEvidence(evidence);
      setNotes(notes);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim() || !id) return;
    try {
      await unwrap(api.post('/notes', { candidateId: id, note: newNote }));
      setNewNote('');
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  if (loading) return <LoadingState label="Loading candidate..." />;
  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (!candidate) return null;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold font-display">{candidate.name}</h1>
      <p className="text-slate-600 mt-1">{candidate.profile.bio}</p>
      <div className="flex gap-4 mt-2 text-sm">
        {candidate.githubUsername && (
          <a href={`https://github.com/${candidate.githubUsername}`} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">GitHub</a>
        )}
        {candidate.profile.linkedin && <a href={candidate.profile.linkedin} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">LinkedIn</a>}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Evidence</h2>
        <div className="mt-3 space-y-2">
          {evidence.length === 0 && <p className="text-sm text-slate-500">No evidence available for this candidate.</p>}
          {evidence.map((e) => (
            <div key={e._id} className="card p-4 flex items-center justify-between">
              <span className="text-sm text-slate-900">{e.skill}</span>
              <EvidenceBadge level={e.evidenceLevel} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-900">Private notes</h2>
        <p className="text-xs text-slate-400 mt-1">Only visible to you. The candidate cannot see these.</p>
        <form onSubmit={addNote} className="flex gap-2 mt-3">
          <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..."
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        <ul className="mt-4 space-y-2">
          {notes.map((n) => (
            <li key={n._id} className="card p-3">
              <p className="text-sm text-slate-800">{n.note}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
