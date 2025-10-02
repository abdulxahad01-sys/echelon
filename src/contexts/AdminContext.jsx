import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as adminService from '../features/admin/services/adminService';
import { toast } from '../components/Toast';

const AdminContext = createContext(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [userRestrictions, setUserRestrictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = user?.email === 'anthonytaye@gmail.com' || 
                 profile?.is_admin || 
                 profile?.is_moderator || 
                 profile?.is_super_admin;
  const shouldLoadData = !loading && isAdmin;

  const loadUsers = useCallback(async () => {
    if (!shouldLoadData) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.loadUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [shouldLoadData]);

  const banUser = useCallback(async (userId, reason, duration) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.banUser(userId, reason, duration);
      await adminService.logAction('ban_user', 'user', userId, { reason, duration });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: true, ban_reason: reason } : u));
      toast.success('User banned successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to ban user');
    }
  }, [isAdmin, user]);

  const unbanUser = useCallback(async (userId) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.unbanUser(userId);
      await adminService.logAction('unban_user', 'user', userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: false, ban_reason: null } : u));
      toast.success('User unbanned successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to unban user');
    }
  }, [isAdmin, user]);

  const deleteUser = useCallback(async (userId, reason) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.deleteUser(userId, reason);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete user');
    }
  }, [isAdmin, user]);

  const loadReports = useCallback(async () => {
    if (!shouldLoadData) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.loadReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [shouldLoadData]);

  const resolveReport = useCallback(async (reportId, action, adminNotes) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.resolveReport(reportId, action, adminNotes);
      await adminService.logAction('resolve_report', 'report', reportId, { action, adminNotes });
      setReports(prev => prev.map(r => r.id === reportId ? { 
        ...r, 
        status: action, 
        admin_notes: adminNotes, 
        resolved_by: user.id, 
        resolved_at: new Date().toISOString() 
      } : r));
      toast.success(`Report ${action} successfully`);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to resolve report');
    }
  }, [isAdmin, user]);

  const deletePost = useCallback(async (postId, reason) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.deletePost(postId, reason);
      await adminService.logAction('delete_post', 'post', postId, { reason });
      toast.success('Post deleted successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete post');
    }
  }, [isAdmin, user]);

  const loadAuditLogs = useCallback(async () => {
    if (!shouldLoadData) return;
    try {
      const data = await adminService.loadAuditLogs();
      setAuditLogs(data);
    } catch (err) {
      setError(err.message);
    }
  }, [shouldLoadData]);

  const loadUserRestrictions = useCallback(async () => {
    if (!shouldLoadData) return;
    try {
      const data = await adminService.loadUserRestrictions();
      setUserRestrictions(data);
    } catch (err) {
      setError(err.message);
    }
  }, [shouldLoadData]);

  const addRestriction = useCallback(async (userId, type, reason, expiresAt) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.addRestriction(userId, type, reason, expiresAt);
      await adminService.logAction('add_restriction', 'user', userId, { type, reason, expiresAt });
      toast.success('Restriction added successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to add restriction');
    }
  }, [isAdmin, user]);

  const removeRestriction = useCallback(async (restrictionId) => {
    if (!isAdmin || !user) return;
    try {
      await adminService.removeRestriction(restrictionId);
      await adminService.logAction('remove_restriction', 'restriction', restrictionId);
      setUserRestrictions(prev => prev.filter(r => r.id !== restrictionId));
      toast.success('Restriction removed successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to remove restriction');
    }
  }, [isAdmin, user]);

  const value = {
    users,
    reports,
    auditLogs,
    userRestrictions,
    isLoading: loading || isLoading,
    error,
    loadUsers,
    banUser,
    unbanUser,
    deleteUser,
    loadReports,
    resolveReport,
    deletePost,
    loadAuditLogs,
    loadUserRestrictions,
    addRestriction,
    removeRestriction
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};