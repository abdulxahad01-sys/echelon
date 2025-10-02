import { X, Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { useState } from "react";

function PostDialog({ isOpen, onClose, post, onLike }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "john_doe", text: "Amazing shot! 📸", time: "2h" },
    { id: 2, user: "jane_smith", text: "Love this place ❤️", time: "1h" },
    { id: 3, user: "mike_wilson", text: "Incredible view!", time: "30m" }
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: "you",
        text: comment,
        time: "now"
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#CAB265] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        
        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full h-64 md:h-full max-h-96 md:max-h-none object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-96 flex flex-col bg-black">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#CAB265]">
            <div className="flex items-center gap-3">
              <img 
                src={post.image} 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white font-['Jost'] text-sm md:text-base">username</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[#8D8D8D] hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="text-[#8D8D8D] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64 md:max-h-none">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img 
                  src={post.image} 
                  alt={comment.user} 
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#CAB265] font-['Jost'] text-sm font-medium">{comment.user}</span>
                    <span className="text-white font-['Jost'] text-sm">{comment.text}</span>
                  </div>
                  <span className="text-[#8D8D8D] font-['Jost'] text-xs">{comment.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Section */}
          <div className="border-t border-[#CAB265] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onLike(post.id)}
                  className="flex items-center gap-1 text-white hover:scale-110 transition-transform"
                >
                  <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="text-white hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="text-white font-['Jost'] text-sm">
              <span className="font-medium">{post.likes} likes</span>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white placeholder-[#8D8D8D] font-['Jost'] text-sm outline-none"
              />
              <button 
                type="submit"
                disabled={!comment.trim()}
                className="text-[#CAB265] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDialog;