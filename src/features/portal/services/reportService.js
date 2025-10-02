// import { supabase } from '../../../lib/supabase';

import { supabase } from "@/integrations/supabase/client";

export const reportService = {
  async submitReport({ reportedUserId, reportedPostId, reason, description }) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to report content.');
      }

      if (!reportedUserId && !reportedPostId) {
        throw new Error('Invalid report target.');
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId || null,
          reported_post_id: reportedPostId || null,
          reason,
          description
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to submit report');
    }
  }
};