import { X, Heart, MessageCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { profileService } from "../services/profileService";
import img from "../../../assets/19. Site Perspective View.webp";
import moment from "moment";

function PostModal({ 
  selectedPost, 
  onClose, 
  onDelete, 
  onPostUpdate 
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedPost) {
      checkIfLiked(selectedPost.id);
    }
  }, [selectedPost]);

  const checkIfLiked = async (postId) => {
    if (!user) return;
    try {
      const liked = await profileService.checkIfLiked(postId, user.id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking if liked:', error);
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user || !selectedPost) return;
    try {
      const newLikedState = await profileService.toggleLike(selectedPost.id, user.id, isLiked);
      setIsLiked(newLikedState);
      const updatedPost = { 
        ...selectedPost, 
        likes_count: newLikedState ? (selectedPost.likes_count || 0) + 1 : (selectedPost.likes_count || 0) - 1 
      };
      onPostUpdate(updatedPost);
      toast({
        title: newLikedState ? "Post liked" : "Post unliked",
        description: newLikedState ? "You've liked this post." : "You've unliked this post.",
      });
    } catch (error) {
      console.error('Error updating like status:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const fetchComments = async (postId) => {
    try {
      const commentsData = await profileService.fetchComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;
    try {
      await profileService.addComment(selectedPost.id, user.id, newComment);
      setNewComment('');
      fetchComments(selectedPost.id);
      const updatedPost = { 
        ...selectedPost, 
        comments_count: (selectedPost.comments_count || 0) + 1 
      };
      onPostUpdate(updatedPost);
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    }
  };

  if (!selectedPost) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden border border-[#CAB265]/20">
        <div className="flex">
          <div className="flex-1 relative">
            {selectedPost.image_url ? (
              <img
                src={selectedPost.image_url}
                alt="Post"
                className="w-full h-full object-contain max-h-[80vh]"
              />
            ) : (
              <div className="flex items-center justify-center h-96 p-8">
                <p className="text-white text-lg text-center font-['Jost']">{selectedPost.content}</p>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="w-80 border-l border-[#CAB265]/20 p-6 flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={profile?.avatar_url || img}
                className="h-10 w-10 rounded-full object-cover border border-[#CAB265]/30"
                alt="Profile"
              />
              <div>
                <p className="text-white font-medium font-['Jost']">{profile?.full_name || 'You'}</p>
                <p className="text-white/60 text-sm font-['Jost']">@{profile?.handle || 'user'}</p>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-white mb-4 font-['Jost']">{selectedPost.content}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    isLiked ? 'text-red-500' : 'text-white/60 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-['Jost']">{selectedPost.likes_count || 0}</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowComments(!showComments);
                    if (!showComments) {
                      fetchComments(selectedPost.id);
                    }
                  }}
                  className="flex items-center space-x-2 text-white/60 hover:text-[#CAB265]"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-['Jost']">{selectedPost.comments_count || 0}</span>
                </button>

                {user?.id === selectedPost.author_id && (
                  <button
                    onClick={() => onDelete(selectedPost)}
                    className="flex items-center space-x-2 text-white/60 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="font-['Jost']">Delete</span>
                  </button>
                )}
              </div>

              {showComments && (
                <div className="border-t border-white/10 pt-4">
                  <div className="max-h-48 overflow-y-auto space-y-3 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.profiles?.avatar_url || img}
                          className="h-8 w-8 rounded-full object-cover border border-[#CAB265]/30"
                          alt="Commenter"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium text-sm font-['Jost']">
                              {comment.profiles?.full_name || 'User'}
                            </span>
                            <span className="text-white/40 text-xs font-['Jost']">
                              {moment(comment.created_at).calendar()}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm mt-1 font-['Jost']">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#CAB265] font-['Jost']"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button
                      onClick={handleComment}
                      disabled={!newComment.trim()}
                      className="bg-[#CAB265] hover:bg-[#A17E3C] text-black px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 font-['Jost']"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-white/40 text-xs font-['Jost']">
              {new Date(selectedPost.created_at).toLocaleDateString()} at{' '}
              {new Date(selectedPost.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;