import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ReportModal from "../components/ReportModal";
import StoryViewer from "../components/StoryViewer";
import StoriesSection from "../components/StoriesSection";
import CreatePostPrompt from "../components/CreatePostPrompt";
import FeedHeader from "../components/FeedHeader";
import PostCard from "../components/PostCard";
import TrialCountdown from "../../../components/TrialCountdown";
import { homeService } from "../services/homeService";
import { interactionService } from "../services/interactionService";
import { storyService } from "../services/storyService";
import { useAuth } from "@/contexts/AuthContext";

function HomePage() {
  const { user, profile } = useAuth();
  const [isSafeModeOn, setIsSafeModeOn] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedPostForReport, setSelectedPostForReport] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [stories, setStories] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentsData, setCommentsData] = useState({});
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [userStories, setUserStories] = useState([]);
  const navigate = useNavigate();

  // Get current user ID from auth
  const currentUserId = user?.id;
  
  const loadComments = async (postId) => {
    try {
      const comments = await interactionService.getComments(postId);
      setCommentsData((prev) => ({ ...prev, [postId]: comments }));
    } catch (error) {
      console.error("Error loading comments:", error.message);
      setCommentsData((prev) => ({ ...prev, [postId]: [] }));
    }
  };

  const addComment = async (postId, content) => {
    // Optimistic update - immediately increase comment count
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      )
    );
    
    try {
      const result = await interactionService.addComment(
        postId,
        currentUserId,
        content
      );
      if (result.success) {
        // Only reload comments for this specific post
        loadComments(postId);
      }
    } catch (error) {
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, comments: post.comments - 1 } : post
        )
      );
      console.error("Error adding comment:", error.message);
    }
  };

  const toggleSafeMode = () => {
    setIsSafeModeOn(!isSafeModeOn);
  };

  const handleReportPost = (postId, userId) => {
    setSelectedPostForReport({ postId, userId });
    setReportModalOpen(true);
  };

  const handleReportSubmitted = () => {
    console.log("Report submitted successfully");
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await homeService.fetchPosts();

      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (post) => {
    try {
      const result = await homeService.sharePost(post);
      if (result.method === "clipboard") {
        console.log("Post link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing post:", error.message);
    }
  };

  const handleLike = async (postId) => {
    const wasLiked = likedPosts.has(postId);
    
    // Optimistic update - immediate UI change
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    
    // Update post like count immediately
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likes: wasLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
    
    // Update database in background
    try {
      await interactionService.toggleLike(postId, currentUserId);
    } catch (error) {
      // Revert optimistic update on error
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likes: wasLiked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
      
      console.error("Error toggling like:", error.message);
    }
  };

  const handleCommentClick = (postId) => {
    // console.log("HandleCommentClick", postId);
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const loadAllUsers = async () => {
    try {
      const users = await homeService.loadAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading users:", error.message);
      setAllUsers([]);
    }
  };

  // Search users effect
  useEffect(() => {
    const q = userSearch.trim();
    if (!q) {
      setUserResults([]);
      if (searchFocused && allUsers.length === 0) {
        loadAllUsers();
      }
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const users = await homeService.searchUsers(q);
        setUserResults(users);
      } catch (error) {
        console.error("Error searching users:", error.message);
        setUserResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [userSearch, searchFocused, allUsers.length]);

  const fetchStories = async () => {
    try {
      const storiesData = await storyService.getStories();
      setStories(storiesData);
      // Get current user's stories
      const currentUserStories = storiesData.filter(story => story.author_id === currentUserId);

      setUserStories(currentUserStories);
    } catch (error) {
      console.error("Error fetching stories:", error.message);
    }
  };


  const [isViewingUserStories, setIsViewingUserStories] = useState(false);

  const handleUserStoryClick = () => {
    if (userStories.length > 0) {
      setSelectedStoryIndex(0);
      setIsViewingUserStories(true);
      setStoryViewerOpen(true);
    } else {
      navigate("/portal/create-story");
    }
  };

  const handlePublicStoryClick = (story) => {
    const publicStories = stories.filter(s => s.author_id !== currentUserId);
    const storyIndex = publicStories.findIndex(s => s.id === story.id);

    setSelectedStoryIndex(storyIndex >= 0 ? storyIndex : 0);
    setIsViewingUserStories(false);
    setStoryViewerOpen(true);
  };

  const handleMarkStoryViewed = async (storyId) => {
    try {
      await storyService.markStoryAsViewed(storyId, currentUserId);
    } catch (error) {
      // Ignore duplicate key errors (user already viewed this story)
      if (!error.message.includes('duplicate key value')) {
        console.error('Error marking story as viewed:', error.message);
      }
    }
  };

  // Initialize liked posts
  const initializeLikedPosts = async () => {
    try {
      const likedPostIds = await homeService.getUserLikedPosts(currentUserId);
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error('Error loading liked posts:', error.message);
    }
  };

  // Initialize safe mode from user profile
  useEffect(() => {
    if (profile) {
      setIsSafeModeOn(profile.safe_mode_enabled !== false); // Default to true
    }
  }, [profile]);

  // Fetch posts and stories on mount
  useEffect(() => {
    if (currentUserId) {
      fetchPosts();
      fetchStories();
    }
  }, [currentUserId]);

  // Initialize liked posts when posts are loaded
  useEffect(() => {
    if (posts.length > 0) {
      initializeLikedPosts();
    }
  }, [posts.length]);

  // Remove real-time feed refresh to prevent automatic refreshing
  // Users will manually refresh to see database updates
  // useEffect(() => {
  //   const unsubscribe = homeService.subscribeToPostUpdates(() => {
  //     fetchPosts();
  //   });
  //   return unsubscribe;
  // }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "now" : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredPosts = posts.filter((post) => {
    // Show non-NSFW posts always
    if (!post.is_nsfw) return true;
    
    // For NSFW posts, show only if safe mode is disabled
    return !isSafeModeOn;
  });

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 min-h-[80vh] bg-black text-white font-['Jost']">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <TrialCountdown />
      </div>
      
      <StoriesSection
        userStories={userStories}
        stories={stories}
        currentUserId={currentUserId}
        onUserStoryClick={handleUserStoryClick}
        onPublicStoryClick={handlePublicStoryClick}
      />

      <CreatePostPrompt
        onNavigateToCreatePost={() => navigate("/portal/create-post")}
      />

      <FeedHeader
        isSafeModeOn={isSafeModeOn}
        onToggleSafeMode={toggleSafeMode}
        onRefreshPosts={fetchPosts}
        loading={loading}
      />

      {/* Posts */}
      {loading ? (
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl flex justify-center py-8">
          <div className="text-[#8D8D8D] font-['Jost']">Loading posts...</div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl flex justify-center py-8">
          <div className="text-[#8D8D8D] font-['Jost']">No posts available</div>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            isLiked={likedPosts.has(post.id)}
            isCommentsExpanded={expandedComments.has(post.id)}
            comments={commentsData[post.id] || []}
            onLike={handleLike}
            onCommentClick={handleCommentClick}
            onShare={handleShare}
            onReport={handleReportPost}
            onLoadComments={loadComments}
            onAddComment={addComment}
            formatDate={formatDate}
          />
        ))
      )}

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedUserId={selectedPostForReport?.userId}
        reportedPostId={selectedPostForReport?.postId}
        onReportSubmitted={handleReportSubmitted}
      />
      
      <StoryViewer
        isOpen={storyViewerOpen}
        onClose={() => {
          setStoryViewerOpen(false);
          setIsViewingUserStories(false);
        }}
        stories={isViewingUserStories ? userStories : stories.filter(s => s.author_id !== currentUserId)}
        initialStoryIndex={selectedStoryIndex}
        currentUserId={currentUserId}
        onMarkViewed={handleMarkStoryViewed}
      />
    </div>
  );
}

export default HomePage;