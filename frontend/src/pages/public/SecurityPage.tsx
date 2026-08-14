const ITEMS = [
  ['Password storage', 'Passwords are hashed with bcrypt (12 salt rounds). Plaintext passwords are never stored or logged.'],
  ['Sessions', 'Authentication uses signed JWTs. Tokens are verified on every protected request.'],
  ['Authorization', 'Every write operation checks resource ownership on the backend, never trusting frontend state alone.'],
  ['Secrets', 'GitHub tokens and the Gemini API key live only in backend environment variables and are never sent to the browser.'],
  ['Rate limiting', 'Authentication endpoints and the general API are rate-limited to reduce abuse.'],
  ['Private data', 'Recruiter notes are never exposed through any candidate-facing route.'],
];

export default function SecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">Security & privacy</h1>
      <div className="mt-8 space-y-6">
        {ITEMS.map(([title, desc]) => (
          <div key={title} className="border-b border-slate-100 pb-6">
            <p className="font-medium text-slate-900">{title}</p>
            <p className="text-sm text-slate-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
