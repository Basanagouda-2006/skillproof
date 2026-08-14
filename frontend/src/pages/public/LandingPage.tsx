import { Link } from 'react-router-dom';
import { ArrowRight, GitCommit, ShieldCheck, Github, FileSearch, Sparkles, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-trace-gradient text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-cyan bg-white/5 border border-white/10 rounded-full px-3 py-1">
              Evidence Trace
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 leading-tight">
              Turn technical claims into verifiable evidence.
            </h1>
            <p className="mt-5 text-slate-300 text-lg leading-relaxed">
              SkillProof connects technical claims to observable development evidence,
              helping candidates present stronger proof of their work and recruiters
              evaluate technical alignment faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">
                Get started <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 text-white px-4 py-2.5 text-sm font-medium hover:border-white/40">
                See how it works
              </Link>
            </div>
          </div>

          {/* Evidence Trace visual: Claim -> Evidence -> Repository -> Verification */}
          <div className="card bg-indigo-900/60 border-white/10 p-6 backdrop-blur-sm">
            <p className="font-mono text-xs text-brand-cyan mb-4">CLAIM → EVIDENCE → REPOSITORY → VERIFICATION</p>
            <ol className="space-y-5">
              {[
                { icon: Sparkles, label: 'Claimed skill', detail: '"React" added to profile' },
                { icon: FileSearch, label: 'Evidence detected', detail: 'react, react-dom in package.json' },
                { icon: Github, label: 'Repository', detail: 'github.com/user/dashboard-app' },
                { icon: ShieldCheck, label: 'Verified', detail: 'STRONG evidence across 3 repos' },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <step.icon size={15} className="text-brand-cyan" />
                  </span>
                  <div>
                    <p className="text-sm text-white font-medium">{step.label}</p>
                    <p className="text-xs text-slate-400 font-mono">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
        <div className="card p-8">
          <p className="text-xs font-mono uppercase tracking-wide text-evidence-weak">The problem</p>
          <h2 className="text-2xl font-semibold mt-2">Resumes list skills. They don't prove them.</h2>
          <p className="text-slate-600 mt-3 leading-relaxed">
            Recruiters have no fast way to check whether a claimed skill reflects real,
            observable work. Candidates have no easy way to show it.
          </p>
        </div>
        <div className="card p-8">
          <p className="text-xs font-mono uppercase tracking-wide text-evidence-strong">The solution</p>
          <h2 className="text-2xl font-semibold mt-2">Evidence, traced back to real repositories.</h2>
          <p className="text-slate-600 mt-3 leading-relaxed">
            SkillProof analyzes real GitHub activity with a deterministic evidence engine,
            then optionally uses AI only to explain what was already verified.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-semibold text-center">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {[
              { title: 'Connect GitHub', desc: 'Candidates link a public GitHub account.' },
              { title: 'Analyze repositories', desc: 'Languages, dependencies, topics, and READMEs are scanned.' },
              { title: 'Generate evidence', desc: 'A deterministic engine assigns traceable evidence levels.' },
              { title: 'Share or match', desc: 'Candidates share profiles; recruiters match against jobs.' },
            ].map((step, i) => (
              <div key={i} className="trace-line">
                <span className={`trace-node ${i === 0 ? 'trace-node--filled' : ''}`} />
                <p className="font-medium text-slate-900">{step.title}</p>
                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidate / Recruiter workflows */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
        <div className="card p-8">
          <GitCommit className="text-brand-blue" size={22} />
          <h3 className="text-xl font-semibold mt-4">For candidates</h3>
          <p className="text-slate-600 mt-2">
            Turn your real development work into evidence you can share, and prepare
            for interviews grounded in what you've actually built.
          </p>
          <Link to="/for-candidates" className="inline-flex items-center gap-1 text-brand-blue text-sm font-medium mt-4 hover:underline">
            Learn more <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card p-8">
          <ShieldCheck className="text-brand-violet" size={22} />
          <h3 className="text-xl font-semibold mt-4">For recruiters</h3>
          <p className="text-slate-600 mt-2">
            Evaluate candidates against job requirements using observable evidence,
            with side-by-side comparisons and evidence-grounded interview packs.
          </p>
          <Link to="/for-recruiters" className="inline-flex items-center gap-1 text-brand-violet text-sm font-medium mt-4 hover:underline">
            Learn more <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Security */}
      <section className="bg-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex items-start gap-4">
          <Lock className="text-brand-cyan shrink-0" size={22} />
          <div>
            <h3 className="text-xl font-semibold">Built with security in mind</h3>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Passwords are hashed with bcrypt, sessions use JWT, and every private
              route is enforced on the backend. GitHub tokens and API keys never
              reach the browser.
            </p>
            <Link to="/security" className="inline-flex items-center gap-1 text-brand-cyan text-sm font-medium mt-4 hover:underline">
              Read our security overview <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold">Ready to turn your work into evidence?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="btn-primary">Create your account</Link>
          <Link to="/login" className="btn-secondary">Log in</Link>
        </div>
      </section>
    </div>
  );
}
