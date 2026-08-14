const FEATURES = [
  'Deterministic evidence engine with documented, non-arbitrary evidence levels',
  'Real GitHub repository analysis (languages, dependencies, topics, README)',
  'Optional AI explanations that can never invent evidence',
  'Evidence reports with full history',
  'Job posting and deterministic requirement detection',
  'Candidate/job matching with a documented scoring formula',
  'Side-by-side candidate comparison',
  'Evidence-grounded interview packs with follow-up questions',
  'Private recruiter notes',
  'Shareable, opt-in public candidate profiles',
];

export default function FeaturesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">Features</h1>
      <ul className="mt-8 space-y-3">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-3 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
