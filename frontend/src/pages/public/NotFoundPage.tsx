import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold font-display">Page not found</h1>
      <p className="text-slate-500 mt-3">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Back to home</Link>
    </div>
  );
}
