import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GitBranch } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-indigo-950 text-white">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <GitBranch size={20} className="text-brand-cyan" />
          SkillProof
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link to="/how-it-works" className="hover:text-white">How it works</Link>
          <Link to="/for-candidates" className="hover:text-white">For candidates</Link>
          <Link to="/for-recruiters" className="hover:text-white">For recruiters</Link>
          <Link to="/features" className="hover:text-white">Features</Link>
          <Link to="/security" className="hover:text-white">Security</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'}
                className="text-sm font-medium text-white hover:text-brand-cyan"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-sm text-slate-300 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white">Log in</Link>
              <Link to="/register" className="btn-primary !py-2 !px-3.5 text-sm">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
