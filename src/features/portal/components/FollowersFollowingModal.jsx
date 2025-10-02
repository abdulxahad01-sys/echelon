import { X, Users, UserPlus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { profileService } from "../services/profileService";
import img from "../../../assets/19. Site Perspective View.webp";
import UserAvatar from "./UserAvatar";

function FollowersFollowingModal({ isOpen, onClose, userId, type, userProfile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!userId || !type) return;
    
    setLoading(true);
    try {
      const data = type === 'followers' 
        ? await profileService.fetchFollowersList(userId)
        : await profileService.fetchFollowingList(userId);
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load ${type}.`,
        variant: "destructive",
      });
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUserClick = (clickedUserId) => {
    onClose();
    navigate(`/portal/profile/${clickedUserId}`);
  };

  if (!isOpen) return null;

  const title = type === 'followers' ? 'Followers' : 'Following';
  const Icon = type === 'followers' ? Users : UserPlus;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[#CAB265]/20 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#CAB265]/20">
          <div className="flex items-center space-x-3">
            <Icon className="size-6 text-[#CAB265]" />
            <h2 className="text-[#CAB265] font-['IvyMode'] text-xl">
              {userProfile?.full_name || 'User'}'s {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-white">
                <Loader2 className="size-5 animate-spin" />
                <span className="font-['Jost']">Loading {type}...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/60 mb-4 font-['Jost']">
                {currentUser?.id === userId 
                  ? `You don't have any ${type} yet.`
                  : `This user doesn't have any ${type} yet.`
                }
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="text-white/80 text-sm font-['Jost'] mb-4">
                {users.length} {type}
              </div>
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <button
                    onClick={(e) => {
                      e.preventDefault
                      handleUserClick(user.id)
                    }}
                    className="flex items-center space-x-3 flex-1 text-left cursor-pointer"
                  >
                    {user.avatar_url ? (
                        <img
                      src={user.avatar_url || img}
                      alt={user.full_name}
                      className="size-12 rounded-full object-cover border border-[#CAB265]/30"
                    />
                    ) : (
                      <UserAvatar />
                    )}
                    

                    <div className="flex-1">
                      <p className="text-white font-medium hover:text-[#CAB265] transition-colors font-['Jost']">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-white/60 text-sm font-['Jost']">
                        @{user.handle || user.full_name?.toLowerCase().replace(/\s+/g, '') || 'member'}
                      </p>
                      <p className="text-white/40 text-xs font-['Jost']">
                        {type === 'followers' ? 'Started following' : 'Followed'} {formatDate(user.follow_created_at)}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersFollowingModal;