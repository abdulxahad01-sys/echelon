import { Grid2x2, Grid3x3, Heart, MessageCircle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PostsGrid({ 
  userPosts, 
  viewMode, 
  onViewModeToggle, 
  onRefresh, 
  onPostClick 
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-black border border-[#CAB265]/20 rounded-lg">
      <div className="flex flex-row items-center justify-between p-6 border-b border-[#CAB265]/20">
        <h2 className="text-[#CAB265] font-['IvyMode'] text-xl">Your Posts</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="text-[#CAB265] hover:text-[#A17E3C] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCcw className="size-4" />
          </button>
          <button
            onClick={onViewModeToggle}
            className="text-[#CAB265] hover:text-[#A17E3C] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            {viewMode === "grid" ? 
              <Grid3x3 className="size-4" /> : 
              <Grid2x2 className="size-4" />
            }
          </button>
        </div>
      </div>
      <div className="p-6">
        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 mb-4 font-['Jost']">You haven't created any posts yet.</div>
            <button
              onClick={() => navigate('/portal/create-post')}
              className="bg-[#CAB265] hover:bg-[#A17E3C] text-black font-semibold px-6 py-3 rounded-lg font-['Jost'] transition-colors cursor-pointer"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <div key={post.id} className="relative group cursor-pointer" onClick={() => onPostClick(post)}>
                <div className="aspect-square bg-black/30 overflow-hidden">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt="Your post" 
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full bg-black/50 flex items-center justify-center p-4">
                      <p className="text-white/80 text-sm text-center line-clamp-4 font-['Jost']">
                        {post.content}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center">
                    <div className="flex items-center space-x-4 text-sm font-medium">
                      <div className="flex items-center space-x-1">
                        <Heart className="size-4" />
                        <span className="font-['Jost']">{post.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="size-4" />
                        <span className="font-['Jost']">{post.comments_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostsGrid;