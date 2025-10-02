import { supabase } from '@/integrations/supabase/client';

export const profileService = {
  // Fetch user posts with counts
  async fetchUserPosts(userId) {
    try {
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_author_id_fkey(
            id,
            full_name,
            avatar_url,
            handle
          )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Get likes and comments count for each post
      const processedPosts = await Promise.all(
        (posts || []).map(async (post) => {
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0
          };
        })
      );

      return processedPosts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Fetch follow statistics
  async fetchFollowStats(userId) {
    try {
      const { count: followersCount, error: followersError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      if (followersError) throw followersError;

      const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      if (followingError) throw followingError;

      return {
        followers: followersCount || 0,
        following: followingCount || 0
      };
    } catch (error) {
      console.error('Error fetching follow stats:', error);
      throw error;
    }
  },

  // Check if user liked a post
  async checkIfLiked(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error checking if liked:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error(error)
      return false;
    }
  },

  // Toggle like on post
  async toggleLike(postId, userId, isLiked) {
    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
        return false;
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userId
          });
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Fetch comments for a post
  async fetchComments(postId) {
    try {
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      const commentsWithProfiles = await Promise.all(
        (comments || []).map(async (comment) => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, handle')
              .eq('id', comment.author_id)
              .single();

            return {
              ...comment,
              profiles: profile || {
                id: comment.author_id,
                full_name: 'Unknown User',
                avatar_url: null,
                handle: 'unknown'
              }
            };
          } catch (error) {
            console.error('Error fetching profile for comment:', error);
            return {
              ...comment,
              profiles: {
                id: comment.author_id,
                full_name: 'Unknown User',
                avatar_url: null,
                handle: 'unknown'
              }
            };
          }
        })
      );

      return commentsWithProfiles;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add comment to post
  async addComment(postId, userId, content) {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: userId,
          content: content.trim()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Update profile
  async updateProfile(userId, profileData) {
    try {
      const updateData = {};
      
      if (profileData.fullName !== undefined) updateData.full_name = profileData.fullName;
      if (profileData.bio !== undefined) updateData.bio = profileData.bio;
      if (profileData.handle !== undefined) updateData.handle = profileData.handle;
      if (profileData.sdcUsername !== undefined) updateData.sdc_username = profileData.sdcUsername;
      if (profileData.mutualProfile !== undefined) updateData.mutual_profile = profileData.mutualProfile;
      if (profileData.fbProfile !== undefined) updateData.fb_profile = profileData.fbProfile;
      if (profileData.avatarUrl !== undefined) updateData.avatar_url = profileData.avatarUrl;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Upload avatar
  async uploadAvatar(userId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Fetch followers list
  async fetchFollowersList(userId) {
    try {
      const { data: follows, error } = await supabase
        .from('follows')
        .select('created_at, follower_id')
        .eq('following_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!follows || follows.length === 0) return [];

      const followerIds = follows.map(f => f.follower_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', followerIds);

      if (profilesError) throw profilesError;

      return follows.map(follow => {
        const profile = profiles?.find(p => p.id === follow.follower_id);
        return {
          ...profile,
          follow_created_at: follow.created_at
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  },

  // Fetch following list
  async fetchFollowingList(userId) {
    try {
      const { data: follows, error } = await supabase
        .from('follows')
        .select('created_at, following_id')
        .eq('follower_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!follows || follows.length === 0) return [];

      const followingIds = follows.map(f => f.following_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', followingIds);

      if (profilesError) throw profilesError;

      return follows.map(follow => {
        const profile = profiles?.find(p => p.id === follow.following_id);
        return {
          ...profile,
          follow_created_at: follow.created_at
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  },

  // Fetch user profile by ID
  async fetchUserProfile(userId) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Search users by name or handle
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
      console.error('Error searching users:', error);
      return [];
    }
  },

  // Load all users
  async loadAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, handle, last_active')
        .order('full_name', { ascending: true })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading all users:', error);
      return [];
    }
  },

  // Check if user is following another user
  async checkFollowStatus(followerId, followingId) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
      
      if (error) {
        throw error;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  },

  // Follow a user
  async followUser(followerId, followingId) {
    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: followerId,
          following_id: followingId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  // Unfollow a user
  async unfollowUser(followerId, followingId) {
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  // Ensure profile exists
  async ensureProfileExists(userId, userEmail) {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail,
            full_name: userEmail?.split('@')[0] || 'User'
          });

        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      throw error;
    }
  }
};