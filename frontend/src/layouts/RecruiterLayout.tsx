import DashboardLayout from './DashboardLayout';

const navItems = [
  { label: 'Dashboard', to: '/recruiter/dashboard' },
  { label: 'Jobs', to: '/recruiter/jobs' },
  { label: 'Candidates', to: '/recruiter/candidates' },
  { label: 'Compare', to: '/recruiter/compare' },
  { label: 'Interview Packs', to: '/recruiter/interview-packs' },
  { label: 'Settings', to: '/recruiter/settings' },
];

export default function RecruiterLayout() {
  return <DashboardLayout navItems={navItems} />;
}
