import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { GitBranch, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface NavItem {
  label: string;
  to: string;
}

export default function DashboardLayout({ navItems }: { navItems: NavItem[] }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = (
    <>
      {navItems.map((item) => {
        const active = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-white/10 text-white'
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-surface-off">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-indigo-950 px-4 text-white md:hidden">
        <Link
          to={user?.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'}
          className="flex items-center gap-2 font-display font-semibold"
        >
          <GitBranch size={20} className="text-brand-cyan" />
          SkillProof
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          className="rounded-md p-2 hover:bg-white/10"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-indigo-950 text-slate-300 transition-transform duration-200 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2 font-display font-semibold text-white">
            <GitBranch size={20} className="text-brand-cyan" />
            SkillProof
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation}
        </nav>

        <div className="border-t border-white/10 p-3">
          <p className="px-3 text-xs text-slate-500 truncate">
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5 hover:text-white"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-indigo-950 text-slate-300 md:flex">
        <div className="flex h-16 items-center gap-2 px-5 font-display font-semibold text-white">
          <GitBranch size={20} className="text-brand-cyan" />
          SkillProof
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation}
        </nav>

        <div className="border-t border-white/10 p-3">
          <p className="px-3 text-xs text-slate-500 truncate">
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5 hover:text-white"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 md:ml-60">
        <Outlet />
      </main>
    </div>
  );
}