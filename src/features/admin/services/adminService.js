import { supabase } from '../../../integrations/supabase/client';

// User Management
export const loadUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const processedUsers = await Promise.all(
    (data || []).map(async (user) => {
      const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);

      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      return {
        ...user,
        post_count: postCount || 0,
        follower_count: followerCount || 0,
        last_login: user.last_active || user.created_at,
      };
    })
  );

  return processedUsers;
};

export const banUser = async (userId, reason, duration) => {
  const expiresAt = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() : null;

  const { error } = await supabase
    .from('profiles')
    .update({
      is_banned: true,
      ban_reason: reason
    })
    .eq('id', userId);

  if (error) throw error;

  if (expiresAt) {
    await supabase
      .from('user_restrictions')
      .insert({
        user_id: userId,
        restriction_type: 'all',
        reason: `Banned: ${reason}`,
        expires_at: expiresAt,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });
  }

  return { success: true };
};

export const unbanUser = async (userId) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_banned: false,
      ban_reason: null
    })
    .eq('id', userId);

  if (error) throw error;

  await supabase
    .from('user_restrictions')
    .delete()
    .eq('user_id', userId)
    .eq('restriction_type', 'all');

  return { success: true };
};

export const deleteUser = async (userId, reason) => {
  const { data, error } = await supabase.rpc('admin_delete_user', {
    p_user_id: userId,
    p_reason: reason
  });

  if (error) throw error;
  if (!data || !data.success) {
    throw new Error(data?.error || 'Failed to delete user');
  }

  return data;
};

// Report Management
export const loadReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reporter_id(*),
      reported_user:profiles!reported_user_id(*),
      reported_post:posts!reported_post_id(*),
      resolved_by_user:profiles!resolved_by(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('relation "reports" does not exist')) {
      return [];
    }
    throw error;
  }

  return data || [];
};

export const resolveReport = async (reportId, action, adminNotes) => {
  const { error } = await supabase
    .from('reports')
    .update({
      status: action,
      admin_notes: adminNotes,
      resolved_by: (await supabase.auth.getUser()).data.user?.id,
      resolved_at: new Date().toISOString()
    })
    .eq('id', reportId);

  if (error) throw error;
  return { success: true };
};

export const deletePost = async (postId, reason) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
  return { success: true };
};

// Audit Logs
export const loadAuditLogs = async () => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      actor:profiles!actor_id(*),
      target:profiles!target_user_id(*)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('relation "audit_logs" does not exist')) {
      return [];
    }
    throw error;
  }

  return data || [];
};

export const logAction = async (actionType, targetType, targetId, details) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      actor_id: user.id,
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      details: details
    });

  if (error) throw error;
  return { success: true };
};

// User Restrictions
export const loadUserRestrictions = async () => {
  const { data, error } = await supabase
    .from('user_restrictions')
    .select(`
      *,
      user:profiles!user_id(*),
      created_by_user:profiles!created_by(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('relation "user_restrictions" does not exist')) {
      return [];
    }
    throw error;
  }

  return data || [];
};

export const addRestriction = async (userId, type, reason, expiresAt) => {
  const { error } = await supabase
    .from('user_restrictions')
    .insert({
      user_id: userId,
      restriction_type: type,
      reason,
      expires_at: expiresAt,
      created_by: (await supabase.auth.getUser()).data.user?.id
    });

  if (error) throw error;
  return { success: true };
};

export const removeRestriction = async (restrictionId) => {
  const { error } = await supabase
    .from('user_restrictions')
    .delete()
    .eq('id', restrictionId);

  if (error) throw error;
  return { success: true };
};