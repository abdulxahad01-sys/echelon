import { supabase } from "@/integrations/supabase/client";
import { profileService } from './profileService';

export const storyService = {
  async createStory({ userId, userEmail, content, image, isNsfw }) {
    try {
      // Ensure profile exists first
      await profileService.ensureProfileExists(userId, userEmail);

      let imageUrl = null;

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('stories')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('stories')
          .getPublicUrl(fileName);
        
        imageUrl = data.publicUrl;
      }

      // Create story with 24-hour expiry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          author_id: userId,
          content: content?.trim() || '',
          image_url: imageUrl,
          is_nsfw: isNsfw,
          expires_at: expiresAt.toISOString()
        });

      if (storyError) throw storyError;

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to create story');
    }
  },
  async getStories() {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_author_id_fkey (
            full_name,
            avatar_url,
            handle
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to load stories');
    }
  },

  async markStoryAsViewed(storyId, userId) {
    try {
      const { error } = await supabase
        .from('story_views')
        .upsert({
          story_id: storyId,
          viewer_id: userId
        }, {
          onConflict: 'story_id,viewer_id'
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to mark story as viewed');
    }
  },

  async getStoryViewers(storyId) {
    try {
      const { data, error } = await supabase
        .from('story_views')
        .select(`
          viewer_id,
          profiles!story_views_viewer_id_fkey (
            full_name,
            avatar_url,
            handle
          )
        `)
        .eq('story_id', storyId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to load story viewers');
    }
  },
};