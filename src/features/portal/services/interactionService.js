import { supabase } from "@/integrations/supabase/client";

export const interactionService = {
  async toggleLike(postId, userId) {
    try {
      // Check if user already liked the post
      const { data: existingLikes, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (checkError) {
        throw checkError;
      }

      if (existingLikes && existingLikes.length > 0) {
        // Unlike the post
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
        return { liked: false };
      } else {
        // Like the post
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userId
          });

        if (error) throw error;
        return { liked: true };
      }
    } catch (error) {
      throw new Error(error.message || "Failed to toggle like");
    }
  },

  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles!comments_author_id_fkey (
            full_name,
            avatar_url,
            membership_tier
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to load comments");
    }
  },

  async addComment(postId, userId, content) {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: userId,
          content: content.trim(),
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(error.message || "Failed to add comment");
    }
  },

  subscribeToComments(postId, callback) {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },


};