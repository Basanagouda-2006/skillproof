import { Link } from 'react-router-dom';

export default function ForCandidatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">For candidates</h1>
      <p className="text-slate-600 mt-3 leading-relaxed">
        Claims are easy to write and hard to verify. SkillProof turns your real development
        work into evidence you can point to, and helps you prepare for interviews that
        actually reference what you've built.
      </p>
      <div className="grid sm:grid-cols-2 gap-5 mt-10">
        {[
          ['Traceable evidence', 'Every skill links back to the exact repositories, dependencies, and files that support it.'],
          ['Honest limitations', 'Evidence levels never claim expertise - they describe what is observable.'],
          ['Evidence-based reports', 'Generate and revisit historical evidence reports as your work grows.'],
          ['Interview preparation', 'See the same evidence-grounded questions recruiters might ask.'],
        ].map(([title, desc]) => (
          <div key={title} className="card p-6">
            <p className="font-medium text-slate-900">{title}</p>
            <p className="text-sm text-slate-600 mt-2">{desc}</p>
          </div>
        ))}
      </div>
      <Link to="/register" className="btn-primary mt-10 inline-flex">Get started as a candidate</Link>
    </div>
  );
}
