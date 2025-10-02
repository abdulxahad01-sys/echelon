import { supabase } from '../../../integrations/supabase/client';

export const chatService = {
  // Get all users for chat list
  async getAllUsers(currentUserId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, handle, membership_tier, updated_at')
        .neq('id', currentUserId)
        .order('full_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get conversations with last message info
  async getConversations(userId) {
    try {
      const { data, error } = await supabase.rpc('get_user_conversations', {
        p_user_id: userId
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  async getMessages(userId, otherUserId) {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(senderId, recipientId, content) {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: senderId,
          recipient_id: recipientId,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  async markMessagesAsRead(userId, otherUserId) {
    try {
      const { error } = await supabase.rpc('mark_messages_as_read', {
        p_user_id: userId,
        p_other_user_id: otherUserId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages(userId, onMessageReceived) {
    const channel = supabase
      .channel(`messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.sender_id === userId || newMessage.recipient_id === userId) {
            onMessageReceived(newMessage);
          }
        }
      )
      .subscribe();

    return channel;
  },

  // Unsubscribe from real-time messages
  unsubscribeFromMessages(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
};