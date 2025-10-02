import { supabase } from "@/integrations/supabase/client";


import { profileService } from './profileService';

export const postService = {
  async createPost({ userId, userEmail, content, image, isNsfw }) {
    try {
      // Ensure profile exists first
      await profileService.ensureProfileExists(userId, userEmail);

      let imageUrl = null;

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, image);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
        
        imageUrl = data.publicUrl;
      }

      // Create post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          author_id: userId,
          content: content.trim(),
          image_url: imageUrl,
          is_nsfw: isNsfw,
        });

      if (postError) throw postError;

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to create post');
    }
  }
};