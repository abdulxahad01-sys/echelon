import { EllipsisVertical, Heart, MessageCircle, Send } from "lucide-react";
import UserAvatar from "./UserAvatar";
import CommentSection from "./CommentSection";
import { useNavigate } from "react-router";
import moment from "moment";

function PostCard({
  post,
  currentUserId,
  isLiked,
  isCommentsExpanded,
  comments,
  onLike,
  onCommentClick,
  onShare,
  onReport,
  onLoadComments,
  onAddComment,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden flex items-center py-4 md:py-5 lg:py-6">
      <div className="w-full flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            <div
              onClick={(e) => {
                e.preventDefault;
                navigate(`/portal/profile/${post.author_id}`);
              }}
              className="cursor-pointer"
            >
              <UserAvatar
                src={post.profiles.avatar_url}
                alt={post.profiles.full_name}
                size="lg"
              />
            </div>
            <div>
              <h1
                onClick={(e) => {
                  e.preventDefault;
                  navigate(`/portal/profile/${post.author_id}`);
                }}
                className="text-lg text-white mb-0.5 cursor-pointer"
              >
                {post.profiles.full_name}
              </h1>
              <p className="text-sm text-[#8D8D8D]">
                {moment(post.created_at).calendar()}
              </p>
            </div>
          </div>
          <div
            onClick={() => onReport(post.id, post.author_id)}
            className="px-0.5 py-1 rounded-lg hover:bg-white/20 cursor-pointer"
          >
            <EllipsisVertical color="#A17E3C" />
          </div>
        </div>
        <p className="text-[#B5B5B5] mb-2.5">{post.content}</p>
        {post.image_url && (
          <img
            src={post.image_url}
            className="w-full rounded-lg object-contain object-center mb-2.5"
            alt="Post content"
          />
        )}
        <div className="w-fit mt-4 grid grid-cols-3 space-x-5">
          <div className="flex items-center gap-2">
            <div
              onClick={() => onLike(post.id)}
              className={`p-2.5 rounded-full border border-[#A17E3C] cursor-pointer hover:bg-[#A17E3C]/10 transition-colors ${
                isLiked ? "bg-[#A17E3C]/20" : ""
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "text-red-500 fill-red-500" : "text-[#fff]"
                }`}
              />
            </div>
            <p className="text-[#fff]">{post.likes}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() => onCommentClick(post.id)}
              className="p-2.5 rounded-full border border-[#A17E3C] cursor-pointer hover:bg-[#A17E3C]/10"
            >
              <MessageCircle className="w-5 h-5 text-[#fff]" />
            </div>
            <p className="text-[#fff]">{post.comments}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() => onShare(post)}
              className="p-2.5 rounded-full border border-[#A17E3C] cursor-pointer hover:bg-[#A17E3C]/10"
            >
              <Send className="w-5 h-5 text-[#fff]" />
            </div>
            <p className="text-[#fff]">Share</p>
          </div>
        </div>

        <CommentSection
          postId={post.id}
          userId={currentUserId}
          isExpanded={isCommentsExpanded}
          comments={comments}
          onLoadComments={onLoadComments}
          onAddComment={onAddComment}
        />
      </div>
    </div>
  );
}

export default PostCard;
