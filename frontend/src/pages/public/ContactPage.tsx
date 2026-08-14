import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold font-display">Contact us</h1>
      {submitted ? (
        <div className="card p-6 mt-8">
          <p className="text-slate-900 font-medium">Message sent.</p>
          <p className="text-sm text-slate-600 mt-1">We'll get back to you soon.</p>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea required rows={4} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue outline-none" />
          </div>
          <button type="submit" className="btn-primary w-full">Send message</button>
        </form>
      )}
    </div>
  );
}
