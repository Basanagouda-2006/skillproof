import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { api, unwrap, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/ui/ErrorState';

export default function SkillsPage() {
  const { user, refreshUser } = useAuth();
  const [skills, setSkills] = useState<string[]>(user?.claimedSkills || []);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setSkills(user.claimedSkills);
  }, [user]);

  async function save(next: string[]) {
    setError('');
    setSaving(true);
    try {
      await unwrap(api.put('/users/me', { claimedSkills: next }));
      await refreshUser();
      setSkills(next);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function addSkill(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    save([...skills, trimmed]);
    setInput('');
  }

  function removeSkill(skill: string) {
    save(skills.filter((s) => s !== skill));
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold font-display">Skills</h1>
      <p className="text-slate-600 text-sm mt-2">
        List the skills you claim. Connect GitHub to see which ones have observable evidence.
      </p>

      {error && <div className="mt-4"><ErrorState message={error} /></div>}

      <form onSubmit={addSkill} className="flex gap-2 mt-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. React"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none"
        />
        <button type="submit" disabled={saving} className="btn-primary !px-3 disabled:opacity-60">
          <Plus size={16} />
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-5">
        {skills.length === 0 && <p className="text-sm text-slate-500">No skills added yet.</p>}
        {skills.map((skill) => (
          <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 pl-3 pr-2 py-1 text-sm">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-evidence-weak">
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
