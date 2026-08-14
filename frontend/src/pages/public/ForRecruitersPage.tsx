import { Link } from 'react-router-dom';

export default function ForRecruitersPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">For recruiters</h1>
      <p className="text-slate-600 mt-3 leading-relaxed">
        Evaluate technical alignment using observable evidence instead of relying only on
        resumes and interviews. You stay in control of every hiring decision - SkillProof
        surfaces evidence, it doesn't decide.
      </p>
      <div className="grid sm:grid-cols-2 gap-5 mt-10">
        {[
          ['Job requirement matching', 'Post a job and see which required skills candidates have observable evidence for.'],
          ['Side-by-side comparison', 'Compare multiple candidates against the same job requirements at once.'],
          ['Interview evidence packs', 'Generate evidence-grounded interview questions for a specific candidate and job.'],
          ['Private notes', 'Keep recruiter-only notes on candidates, never visible to them.'],
        ].map(([title, desc]) => (
          <div key={title} className="card p-6">
            <p className="font-medium text-slate-900">{title}</p>
            <p className="text-sm text-slate-600 mt-2">{desc}</p>
          </div>
        ))}
      </div>
      <Link to="/register" className="btn-primary mt-10 inline-flex">Get started as a recruiter</Link>
    </div>
  );
}
