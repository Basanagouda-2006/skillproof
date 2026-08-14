export default function HowItWorksPage() {
  const steps = [
    { title: 'Create an account', desc: 'Sign up as a candidate or recruiter.' },
    { title: 'Connect GitHub', desc: 'Candidates link a public GitHub username. No token is ever exposed to the browser.' },
    { title: 'Repositories are analyzed', desc: 'The backend pulls real repository metadata: languages, topics, package.json dependencies, and README text.' },
    { title: 'Deterministic evidence is generated', desc: 'A rules-based engine (not AI) assigns each skill an evidence level: Strong, Moderate, Weak, or No Evidence, with a traceable list of reasons.' },
    { title: 'AI explains, never invents', desc: 'If configured, Gemini can summarize the verified evidence in plain language. The app works fully without it.' },
    { title: 'Share or match', desc: 'Candidates can share a public evidence profile. Recruiters can match candidates against job requirements and generate interview packs.' },
  ];
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">How SkillProof works</h1>
      <p className="text-slate-600 mt-3">From a GitHub account to traceable, explainable evidence.</p>
      <ol className="mt-10 space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="trace-line">
            <span className="trace-node trace-node--filled" />
            <p className="font-medium text-slate-900">{s.title}</p>
            <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
