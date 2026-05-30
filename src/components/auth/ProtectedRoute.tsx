import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen bg-deep-black flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(57,255,20,0.4)]"></div>
        <div className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono animate-pulse">
          Validating Security State...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to Auth page, storing current location
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
