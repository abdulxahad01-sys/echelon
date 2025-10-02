import { X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserAvatar from "./UserAvatar";

function EditProfileModal({ isOpen, onClose, onProfileUpdate }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    handle: "",
    sdcUsername: "",
    mutualProfile: "",
    fbProfile: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch fresh profile data when modal opens
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id || !isOpen) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        // If profile exists, use it; otherwise use empty values
        const profileData = data || {};
        
        setFormData({
          fullName: profileData.full_name || user?.user_metadata?.full_name || "",
          bio: profileData.bio || "",
          handle: profileData.handle || "",
          sdcUsername: profileData.sdc_username || "",
          mutualProfile: profileData.mutual_profile || "",
          fbProfile: profileData.fb_profile || "",
        });
        setAvatarPreview(profileData.avatar_url || "");
        setAvatarFile(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use user metadata as fallback
        setFormData({
          fullName: user?.user_metadata?.full_name || "",
          bio: "",
          handle: "",
          sdcUsername: "",
          mutualProfile: "",
          fbProfile: "",
        });
        setAvatarPreview("");
        setAvatarFile(null);
      }
    };

    fetchProfileData();
  }, [user, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      let avatarUrl = avatarPreview;
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatars/${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
        
        avatarUrl = data.publicUrl;
      }
      
      const updateData = {
        full_name: formData.fullName.trim(),
        bio: formData.bio.trim(),
        handle: formData.handle.trim() || null,
        sdc_username: formData.sdcUsername.trim() || null,
        mutual_profile: formData.mutualProfile.trim() || null,
        fb_profile: formData.fbProfile.trim() || null,
        avatar_url: avatarUrl,
      };

      // Try update first
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
      
      onProfileUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#CAB265] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#CAB265]">
          <h2 className="text-[#CAB265] font-['IvyMode'] text-xl">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-[#8D8D8D] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Avatar Section */}
          <div className="space-y-3">
            <label className="text-white font-['Jost'] text-sm">Profile Picture</label>
            <div className="flex items-center gap-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#CAB265]"
                />
              ) : (
               <UserAvatar size="lg" />
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#A17E3C] text-white rounded-lg hover:bg-[#8B6A32] transition-colors text-sm font-['Jost']">
                    <Upload className="w-4 h-4" />
                    Upload
                  </div>
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={clearAvatar}
                    className="text-red-400 hover:text-red-300 text-xs font-['Jost']"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-white font-['Jost'] text-sm">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 bg-transparent border border-[#CAB265] rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C]"
            />
          </div>

          {/* Handle */}
          <div className="space-y-2">
            <label className="text-white font-['Jost'] text-sm">Handle</label>
            <input
              type="text"
              value={formData.handle}
              onChange={(e) => handleInputChange("handle", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="Enter your handle (username)"
              className="w-full px-3 py-2 bg-transparent border border-[#CAB265] rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C]"
            />
            <p className="text-[#8D8D8D] text-xs font-['Jost']">Only lowercase letters, numbers, and underscores allowed</p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-white font-['Jost'] text-sm">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 bg-transparent border border-[#CAB265] rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C] resize-none"
            />
            <p className="text-[#8D8D8D] text-xs font-['Jost']">{formData.bio.length}/500 characters</p>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <label className="text-[#CAB265] font-['Jost'] text-sm font-medium">Social Media Profiles</label>
            
            <div className="space-y-2">
              <label className="text-white font-['Jost'] text-sm">SDC Username</label>
              <input
                type="text"
                value={formData.sdcUsername}
                onChange={(e) => handleInputChange("sdcUsername", e.target.value)}
                placeholder="Enter your SDC username"
                className="w-full px-3 py-2 bg-transparent border border-[#CAB265] rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white font-['Jost'] text-sm">MUTUAL/S Profile Name</label>
              <input
                type="text"
                value={formData.mutualProfile}
                onChange={(e) => handleInputChange("mutualProfile", e.target.value)}
                placeholder="Enter your MUTUAL/S profile name"
                className="w-full px-3 py-2 bg-transparent border border-[#CAB265] rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white font-['Jost'] text-sm">Facebook Profile</label>
              <input
                type="text"
                value={formData.fbProfile}
                onChange={(e) => handleInputChange("fbProfile", e.target.value)}
                placeholder="Enter your Facebook profile URL or username"
                className="w-full px-3 py-2 bg-transparent border border-[#CAB265] rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#A17E3C]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#CAB265] text-[#CAB265] rounded-lg hover:bg-[#CAB265]/10 transition-colors font-['Jost'] text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#A17E3C] text-white rounded-lg hover:bg-[#8B6A32] transition-colors font-['Jost'] text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;