import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  /** Renders child if logged in, else redirects to login. */
  const { user, loading } = useAuth();
  if (loading) return <div className="centered">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}
