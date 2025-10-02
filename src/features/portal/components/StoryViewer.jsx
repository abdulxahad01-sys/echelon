import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Eye, Send } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { storyService } from "../services/storyService";
import moment from "moment";

function StoryViewer({ isOpen, onClose, stories, initialStoryIndex = 0, currentUserId, onMarkViewed }) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);

  // Reset to initial story index when viewer opens or initialStoryIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialStoryIndex);
      setProgress(0);
    }
  }, [isOpen, initialStoryIndex]);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const [storyViewers, setStoryViewers] = useState([]);
  // const [commentText, setCommentText] = useState("");
  // const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, isPaused]);

  useEffect(() => {
    if (isOpen && stories[currentIndex] && onMarkViewed) {
      onMarkViewed(stories[currentIndex].id);
    }
  }, [currentIndex, isOpen, stories]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setProgress(0);
    onClose();
  };

  // const handleLike = () => {
  //   setIsLiked(!isLiked);
  // };

  // const handleComment = () => {
  //   if (commentText.trim()) {
  //     setCommentText("");
  //     // Story messaging functionality will be implemented later
  //   }
  // };

  const handleViewStory = async () => {
    if (currentStory.author_id === currentUserId) {
      try {
        setIsPaused(true);
        const viewers = await storyService.getStoryViewers(currentStory.id);

        const formattedViewers = viewers.map(viewer => ({
          id: viewer.viewer_id,
          name: viewer.profiles?.full_name || 'Unknown User',
          avatar: viewer.profiles?.avatar_url,
          time: 'Recently'
        }));
        setStoryViewers(formattedViewers);
        setShowViewers(true);
      } catch (error) {
        console.error('Error loading story viewers:', error.message);
        // Show modal even if no viewers found
        setStoryViewers([]);
        setShowViewers(true);
        setIsPaused(false);
      }
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };



  if (!isOpen || !stories.length) return null;

  const currentStory = stories[currentIndex];
  if (!currentStory) return null;
  
  const isOwnStory = currentStory.author_id === currentUserId;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: index < currentIndex ? '100%' : 
                       index === currentIndex ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <UserAvatar
            src={currentStory.profiles?.avatar_url}
            alt={currentStory.profiles?.full_name}
            size="sm"
            className="border-2 border-white"
          />
          <div>
            <p className="text-white font-['Jost'] text-sm font-medium">
              {currentStory.profiles?.full_name || 'Unknown User'}
            </p>
            <p className="text-white/70 font-['Jost'] text-xs">
              {moment(currentStory.created_at).calendar()}
            </p>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="text-white hover:text-white/70 transition-colors"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Story content */}
      <div className="relative size-full flex items-center justify-center">
        {currentStory.image_url ? (
          <img
            src={currentStory.image_url}
            className="max-w-full max-h-full object-contain"
            alt="Story content"
          />
        ) : currentStory.video_url ? (
          <video
            src={currentStory.video_url}
            className="max-w-full max-h-full object-contain"
            autoPlay
            muted
            loop
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#A17E3C] to-[#8B6A32]">
            <p className="text-white text-xl font-['Jost'] text-center px-8">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Navigation areas */}
        <button 
          onClick={handlePrev}
          className="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-start pl-4"
          disabled={currentIndex === 0}
        >
          {currentIndex > 0 && (
            <ChevronLeft className="w-8 h-8 text-white/50 hover:text-white transition-colors" />
          )}
        </button>
        
        <button 
          onClick={togglePause}
          className="absolute left-1/3 top-0 w-1/3 h-full z-10 flex items-center justify-center"
        >
          {isPaused && (
            <div className="size-0 bg-black/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
              {/* <div className="text-white text-sm font-['Jost'] font-medium">⏸️</div> */}{" "}
            </div>
          )}
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-end pr-4"
        >
          <ChevronRight className="size-8 text-white/50 hover:text-white transition-colors" />
        </button>
      </div>

      {/* Story text content overlay */}
      {currentStory.content && (currentStory.image_url || currentStory.video_url) && (
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <p className="text-white font-['Jost'] text-center bg-black/50 rounded-lg p-4">
            {currentStory.content}
          </p>
        </div>
      )}

      {/* Story interactions */}
      {!isOwnStory && (
        // <div className="absolute bottom-4 left-4 right-4 z-20">
        //   <div className="flex items-center gap-4 mb-4">
        //     <button 
        //       onClick={handleLike}
        //       className="text-white hover:scale-110 transition-transform"
        //     >
        //       <Heart className={`size-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        //     </button>
        //     <button className="text-white hover:scale-110 transition-transform">
        //       <Send className="size-6" />
        //     </button>
        //   </div>
          
        //   <div className="flex items-center gap-2">
        //     <input
        //       type="text"
        //       value={commentText}
        //       onChange={(e) => setCommentText(e.target.value)}
        //       onFocus={() => setIsPaused(true)}
        //       onBlur={() => setIsPaused(false)}
        //       placeholder="Send message..."
        //       className="flex-1 px-4 py-2 bg-transparent border border-white/30 rounded-full text-white placeholder-white/70 font-['Jost'] text-sm focus:outline-none focus:border-white"
        //       onKeyPress={(e) => e.key === 'Enter' && handleComment()}
        //     />
        //     <button 
        //       onClick={handleComment}
        //       disabled={!commentText.trim()}
        //       className="text-white hover:scale-110 transition-transform disabled:opacity-50"
        //     >
        //       <Send className="size-5" />
        //     </button>
        //   </div>
        // </div> 
        <></>
      )}

      {/* Story views (only for own stories) */}
      {isOwnStory && (
        <div className="absolute bottom-6 left-4 z-20">
          <button 
            onClick={handleViewStory}
            className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-all"
          >
            <Eye className="size-4" />
            <span className="font-['Jost'] text-sm">Viewed by {storyViewers.length}</span>
          </button>
        </div>
      )}

      {/* Story viewers modal */}
      {showViewers && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-end z-[60]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewers(false);
              setIsPaused(false);
            }
          }}
        >
          <div className="w-full bg-black rounded-t-2xl p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-['Jost'] text-lg font-medium">
                Viewed by {storyViewers.length}
              </h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewers(false);
                  setIsPaused(false);
                }}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {storyViewers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/50 font-['Jost'] text-sm">No views yet</p>
                </div>
              ) : (
                storyViewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center gap-3">
                    <UserAvatar
                      src={viewer.avatar}
                      alt={viewer.name}
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="text-white font-['Jost'] text-sm">{viewer.name}</p>
                    </div>
                    <p className="text-white/50 font-['Jost'] text-xs">{viewer.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryViewer;