import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "../components/ProfileHeader";
import PostsGrid from "../components/PostsGrid";
import PostModal from "../components/PostModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import EditProfileModal from "../components/EditProfileModal";
import FollowersFollowingModal from "../components/FollowersFollowingModal";
import { profileService } from "../services/profileService";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Auto-redirect to current user's profile if no ID provided
  useEffect(() => {
    if (!id && user?.id) {
      navigate(`/portal/profile/${user.id}`, { replace: true });
    }
  }, [id, user?.id, navigate]);
  
  // Determine which user's profile to show
  const targetUserId = id || user?.id;
  const isOwnProfile = !id || id === user?.id;

  const fetchUserPosts = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    try {
      const posts = await profileService.fetchUserPosts(targetUserId);
      setUserPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts.",
        variant: "destructive",
      });
      setUserPosts([]);
    }
  };

  const fetchFollowStats = async () => {
    if (!targetUserId) return;
    try {
      const stats = await profileService.fetchFollowStats(targetUserId);
      setFollowersCount(stats.followers);
      setFollowingCount(stats.following);
    } catch (error) {
      console.error('Error loading follow stats:', error);
      setFollowersCount(0);
      setFollowingCount(0);
    }
  };

  const fetchProfileUser = async () => {
    if (!targetUserId) return;
    try {
      if (isOwnProfile) {
        setProfileUser(profile);
      } else {
        const userProfile = await profileService.fetchUserProfile(targetUserId);
        setProfileUser(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileUser(null);
      if (!isOwnProfile) {
        toast({
          title: "Error",
          description: "User profile not found.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handlePostUpdate = (updatedPost) => {
    setSelectedPost(updatedPost);
    setUserPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleDeleteRequest = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;
    setDeleteLoading(true);
    try {
      await profileService.deletePost(selectedPost.id);
      setUserPosts(prev => prev.filter(post => post.id !== selectedPost.id));
      setSelectedPost(null);
      setDeleteDialogOpen(false);
      toast({
        title: "Post deleted",
        description: "Your post has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
      console.error(error)
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserPosts();
    fetchFollowStats();
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  };

  const handleProfileUpdate = () => {
    fetchUserPosts();
    fetchFollowStats();
  };



  useEffect(() => {
    const loadProfile = async () => {
      if (targetUserId && user) {
        setLoading(true);
        try {
          await Promise.all([
            fetchUserPosts(),
            fetchFollowStats(),
            fetchProfileUser()
          ]);
        } catch (error) {
          console.error('Error loading profile data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [targetUserId, user?.id, profile?.id]);

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen={true}
        text="Loading profile..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Floating Create Post Button */}
      <button
        onClick={() => navigate('/portal/create-post')}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-[#CAB265] hover:bg-[#A17E3C] shadow-2xl hover:shadow-[#CAB265]/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        <Plus className="h-8 w-8 text-black font-bold" />
      </button>

      <div className="max-w-4xl mx-auto p-6">
        <ProfileHeader
          followersCount={followersCount}
          followingCount={followingCount}
          userPostsCount={userPosts.length}
          onEditProfile={() => setIsEditModalOpen(true)}
          onFollowersClick={() => setFollowersModalOpen(true)}
          onFollowingClick={() => setFollowingModalOpen(true)}
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
        />
        
        <PostsGrid
          userPosts={userPosts}
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          onRefresh={handleRefresh}
          onPostClick={handlePostClick}
        />
      </div>
      
      <PostModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={handleDeleteRequest}
        onPostUpdate={handlePostUpdate}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
      
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />
      
      <FollowersFollowingModal
        isOpen={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
        userId={targetUserId}
        type="followers"
        userProfile={profileUser}
      />
      
      <FollowersFollowingModal
        isOpen={followingModalOpen}
        onClose={() => setFollowingModalOpen(false)}
        userId={targetUserId}
        type="following"
        userProfile={profileUser}
      />
    </div>
  );
}

export default Profile;