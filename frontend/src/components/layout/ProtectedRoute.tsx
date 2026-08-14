import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../ui/LoadingState';
import type { Role } from '../../types';

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: Role;
}) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState label="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}
