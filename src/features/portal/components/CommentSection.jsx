import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import img from "../../../assets/19. Site Perspective View.webp";
import moment from "moment";

function CommentSection({ postId, userId, isExpanded, comments, onLoadComments, onAddComment }) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isExpanded && comments.length === 0 && onLoadComments) {
      setLoading(true);
      onLoadComments(postId).finally(() => setLoading(false));
    }
  }, [isExpanded, postId, comments.length, onLoadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userId || !onAddComment) return;

    try {
      setSubmitting(true);
      await onAddComment(postId, newComment);
      setNewComment("");
    } catch (error) {
      console.error('Error adding comment:', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isExpanded) return null;

  return (
    <div className="mt-4 border-t border-[#A17E3C]/30 pt-4">
      {/* Comments List */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {loading ? (
          <div className="text-[#8D8D8D] text-sm font-['Jost']">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-[#8D8D8D] text-sm font-['Jost']">No comments yet</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.profiles?.avatar_url || img}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                alt={comment.profiles?.full_name}
              />
              <div className="flex-1">
                <div className="bg-[#1A1A1A] rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium font-['Jost']">
                      {comment.profiles?.full_name || 'Unknown User'}
                    </span>
                    <span className="text-[#8D8D8D] text-xs font-['Jost']">
                      {moment(comment.created_at).calendar()}
                    </span>
                  </div>
                  <p className="text-white text-sm font-['Jost']">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      {userId && (
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 bg-transparent border border-[#A17E3C]/30 rounded-full text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C]"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="p-2 bg-[#A17E3C] text-white rounded-full hover:bg-[#8B6A32] transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default CommentSection;