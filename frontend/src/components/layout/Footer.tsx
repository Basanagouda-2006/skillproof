import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-indigo-950 text-slate-400 border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-display text-white font-semibold mb-3">SkillProof</p>
          <p className="text-slate-500">Turn technical claims into verifiable evidence.</p>
        </div>
        <div>
          <p className="text-white font-medium mb-3">Product</p>
          <ul className="space-y-2">
            <li><Link to="/how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/security" className="hover:text-white">Security</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium mb-3">Audiences</p>
          <ul className="space-y-2">
            <li><Link to="/for-candidates" className="hover:text-white">For candidates</Link></li>
            <li><Link to="/for-recruiters" className="hover:text-white">For recruiters</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium mb-3">Company</p>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
