import DashboardLayout from './DashboardLayout';

const navItems = [
  { label: 'Dashboard', to: '/candidate/dashboard' },
  { label: 'Profile', to: '/candidate/profile' },
  { label: 'Skills', to: '/candidate/skills' },
  { label: 'GitHub', to: '/candidate/github' },
  { label: 'Repositories', to: '/candidate/repositories' },
  { label: 'Evidence', to: '/candidate/evidence' },
  { label: 'Reports', to: '/candidate/reports' },
  { label: 'Job Matches', to: '/candidate/matches' },
  { label: 'Interview Prep', to: '/candidate/interview-prep' },
  { label: 'Share Profile', to: '/candidate/share' },
  { label: 'Settings', to: '/candidate/settings' },
];

export default function CandidateLayout() {
  return <DashboardLayout navItems={navItems} />;
}
