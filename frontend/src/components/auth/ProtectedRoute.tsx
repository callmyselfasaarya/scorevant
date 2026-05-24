import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#F4C542] animate-spin" />
        <p className="text-[#F4C542] text-xs font-black uppercase tracking-widest">Authenticating</p>
      </div>
    );
  }

  if (!user) {
    setLocation('/login');
    return null;
  }

  return <Component />;
};
