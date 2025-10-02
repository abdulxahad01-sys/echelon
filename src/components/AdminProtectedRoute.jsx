import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./ui/LoadingSpinner";

const AdminProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  // If user exists but profile is null and not loading, redirect to home
  if (user && !profile && !loading) {
    return <Navigate to="/" replace />;
  }

  // Show loading only if auth is still loading
  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen={true}
        size="xl"
        text="Loading admin panel..."
      />
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user is admin by email or profile flags
  const isAdminUser =
    user?.email === "anthonytaye@gmail.com" ||
    profile?.is_admin ||
    profile?.is_moderator ||
    profile?.is_super_admin;

  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
