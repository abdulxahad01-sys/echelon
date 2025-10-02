import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";
import UserAvatar from "./UserAvatar";
import moment from "moment";

function ProfileHeader({
  followersCount,
  followingCount,
  userPostsCount,
  onEditProfile,
  onFollowersClick,
  onFollowingClick,
  profileUser,
  isOwnProfile,
}) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const displayProfile = profileUser;


  // Check if already following
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !displayProfile || isOwnProfile) return;

      try {
        const isFollowingUser = await profileService.checkFollowStatus(
          user.id,
          displayProfile.id
        );
        setIsFollowing(isFollowingUser);
      } catch (error) {
        // Silently handle follow table errors (table might not exist)
        if (error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
          console.error('Follow functionality not available');
        } else {
          console.error('Error checking follow status:', error);
        }
        setIsFollowing(false);
      }
    };

    checkFollowStatus();
  }, [user, displayProfile, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!user || !displayProfile) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await profileService.unfollowUser(user.id, displayProfile.id);
        setIsFollowing(false);
      } else {
        await profileService.followUser(user.id, displayProfile.id);
        setIsFollowing(true);
      }
    } catch (error) {
      if (error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
        console.error('Follow functionality not available');
      } else {
        console.error("Error toggling follow:", error);
      }
    } finally {
      setFollowLoading(false);
    }
  };


  return (
    <div className="bg-black border border-[#CAB265]/20 rounded-lg mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-6">
              <UserAvatar
                src={displayProfile?.avatar_url}
                alt="Profile"
                className="size-24 md:size-32 border-2 border-[#CAB265]/30"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-semibold text-white font-['IvyMode']">
                      {displayProfile?.full_name || "Unknown User"}
                    </h1>
                  </div>
                  <p className="text-white/60 font-['Jost']">
                    @
                    {displayProfile?.handle ||
                      displayProfile?.full_name?.toLowerCase().replace(/\s+/g, "") ||
                      "member"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-8 text-center">
              <div className="hover:bg-white/5 rounded-lg p-2 transition-colors">
                <div className="text-xl font-bold text-white font-['Jost']">
                  {userPostsCount}
                </div>
                <div className="text-white/60 text-sm font-['Jost']">Posts</div>
              </div>
              <button
                onClick={onFollowersClick}
                className="hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold text-white hover:text-[#CAB265] transition-colors font-['Jost']">
                  {followersCount.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm font-['Jost']">
                  Followers
                </div>
              </button>
              <button
                onClick={onFollowingClick}
                className="hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold text-white hover:text-[#CAB265] transition-colors font-['Jost']">
                  {followingCount.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm font-['Jost']">
                  Following
                </div>
              </button>
            </div>

            <div className="text-white/80">
              <p className="mb-2 font-['Jost']">
                {displayProfile?.bio || "No bio yet"}
              </p>

              {(displayProfile?.sdc_username ||
                displayProfile?.mutual_profile ||
                displayProfile?.fb_profile) && (
                <div className="mb-4">
                  <h4 className="text-[#CAB265] font-semibold mb-2 font-['Jost']">
                    Social Profiles
                  </h4>
                  <div className="space-y-1 text-sm">
                    {displayProfile?.sdc_username && (
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 font-['Jost']">
                          SDC:
                        </span>
                        <span className="text-[#CAB265] font-['Jost']">
                          {displayProfile.sdc_username}
                        </span>
                      </div>
                    )}
                    {displayProfile?.mutual_profile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 font-['Jost']">
                          MUTUAL/S:
                        </span>
                        <span className="text-[#CAB265] font-['Jost']">
                          {displayProfile.mutual_profile}
                        </span>
                      </div>
                    )}
                    {displayProfile?.fb_profile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 font-['Jost']">
                          Facebook:
                        </span>
                        <span className="text-[#CAB265] font-['Jost']">
                          {displayProfile.fb_profile}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-white/60 text-sm font-['Jost']">
                Member since{" "}
                {displayProfile?.created_at
                  ? moment(displayProfile.created_at).calendar()
                  : "Recently"}
              </p>
            </div>

            <div className="w-full">
              {isOwnProfile ? (
                <button
                  onClick={onEditProfile}
                  className="w-full border border-[#CAB265]/50 text-[#CAB265] hover:bg-[#CAB265]/20 px-4 py-2 rounded-lg font-['Jost'] transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`w-full px-4 py-2 rounded-lg font-['Jost'] transition-colors cursor-pointer ${
                    isFollowing
                      ? "bg-[#CAB265] text-black hover:bg-[#CAB265]/80"
                      : "border border-[#CAB265]/50 text-[#CAB265] hover:bg-[#CAB265]/20"
                  } disabled:opacity-50`}
                >
                  {followLoading
                    ? "Loading..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
