import { supabase } from "@/integrations/supabase/client";

export const homeService = {
  async fetchPosts() {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_author_id_fkey (
            full_name,
            avatar_url,
            membership_tier,
            handle
          ),
          likes:likes(count),
          comments:comments(count)
        `)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

        
      if (error) throw error;

      const transformedPosts = postsData?.map(post => ({
        id: post.id,
        author_id: post.author_id,
        content: post.content,
        image_url: post.image_url,
        video_url: post.video_url,
        is_nsfw: post.is_nsfw,
        location: post.location,
        created_at: post.created_at,
        likes: post.likes?.[0]?.count || 0,
        comments: post.comments?.[0]?.count || 0,
        profiles: {
          full_name: post.profiles?.full_name || 'Unknown User',
          avatar_url: post.profiles?.avatar_url,
          membership_tier: post.profiles?.membership_tier || 'basic',
          handle: post.profiles?.handle
        }
      })) || [];

      return transformedPosts;
    } catch (error) {
      throw new Error(error.message || 'Failed to load posts');
    }
  },

  async sharePost(post) {
    try {
      const shareUrl = `${window.location.origin}/post/${post.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.profiles.full_name}`,
          text: post.content,
          url: shareUrl,
        });
        return { method: 'native' };
      } else {
        await navigator.clipboard.writeText(shareUrl);
        return { method: 'clipboard' };
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      try {
        const shareUrl = `${window.location.origin}/post/${post.id}`;
        await navigator.clipboard.writeText(shareUrl);
        return { method: 'clipboard' };
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        throw new Error('Failed to share post. Please try again.');
      }
    }
  },

  async searchUsers(query) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, handle')
        .or(`full_name.ilike.%${query}%,handle.ilike.%${query}%`)
        .order('full_name', { ascending: true })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to search users');
    }
  },

  async loadAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, handle')
        .order('full_name', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to load users');
    }
  },

  subscribeToPostUpdates(callback) {
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  async getUserLikedPosts(userId) {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return new Set(data?.map(like => like.post_id) || []);
    } catch (error) {
      throw new Error(error.message || 'Failed to load liked posts');
    }
  }
};