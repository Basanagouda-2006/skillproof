import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import PublicLayout from './layouts/PublicLayout';
import CandidateLayout from './layouts/CandidateLayout';
import RecruiterLayout from './layouts/RecruiterLayout';

import LandingPage from './pages/public/LandingPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ForCandidatesPage from './pages/public/ForCandidatesPage';
import ForRecruitersPage from './pages/public/ForRecruitersPage';
import FeaturesPage from './pages/public/FeaturesPage';
import SecurityPage from './pages/public/SecurityPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PublicProfilePage from './pages/public/PublicProfilePage';
import NotFoundPage from './pages/public/NotFoundPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import CandidateDashboardPage from './pages/candidate/CandidateDashboardPage';
import ProfilePage from './pages/candidate/ProfilePage';
import SkillsPage from './pages/candidate/SkillsPage';
import GitHubConnectPage from './pages/candidate/GitHubConnectPage';
import RepositoriesPage from './pages/candidate/RepositoriesPage';
import EvidenceListPage from './pages/candidate/EvidenceListPage';
import EvidenceDetailPage from './pages/candidate/EvidenceDetailPage';
import ReportsPage from './pages/candidate/ReportsPage';
import JobMatchesPage from './pages/candidate/JobMatchesPage';
import InterviewPrepPage from './pages/candidate/InterviewPrepPage';
import SharePage from './pages/candidate/SharePage';
import SettingsPage from './pages/candidate/SettingsPage';

import RecruiterDashboardPage from './pages/recruiter/RecruiterDashboardPage';
import JobsPage from './pages/recruiter/JobsPage';
import CandidatesPage from './pages/recruiter/CandidatesPage';
import CandidateDetailPage from './pages/recruiter/CandidateDetailPage';
import ComparePage from './pages/recruiter/ComparePage';
import InterviewPacksPage from './pages/recruiter/InterviewPacksPage';
import RecruiterSettingsPage from './pages/recruiter/RecruiterSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/for-candidates" element={<ForCandidatesPage />} />
            <Route path="/for-recruiters" element={<ForRecruitersPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/p/:slug" element={<PublicProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Candidate app */}
          <Route
            path="/candidate"
            element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CandidateDashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="github" element={<GitHubConnectPage />} />
            <Route path="repositories" element={<RepositoriesPage />} />
            <Route path="evidence" element={<EvidenceListPage />} />
            <Route path="evidence/:skill" element={<EvidenceDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="matches" element={<JobMatchesPage />} />
            <Route path="interview-prep" element={<InterviewPrepPage />} />
            <Route path="share" element={<SharePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Recruiter app */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<RecruiterDashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:id" element={<CandidateDetailPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="interview-packs" element={<InterviewPacksPage />} />
            <Route path="settings" element={<RecruiterSettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
