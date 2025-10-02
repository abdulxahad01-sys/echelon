import { RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function FeedHeader({ isSafeModeOn, onToggleSafeMode, onRefreshPosts, loading }) {
  const { user, updateProfile } = useAuth();

  const handleSafeModeToggle = async () => {
    const newSafeModeState = !isSafeModeOn;
    
    // Update UI immediately
    onToggleSafeMode();
    
    // Update database
    if (user && updateProfile) {
      try {
        await updateProfile({ safe_mode_enabled: newSafeModeState });
      } catch (error) {
        console.error('Error updating safe mode:', error);
        // Revert UI change on error
        onToggleSafeMode();
      }
    }
  };
  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden flex items-center justify-between py-4 md:py-5 lg:py-6">
      <h1 className="text-xl font-semibold font-['Jost']">Community Feed</h1>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleSafeModeToggle}
          className="px-8 py-2 flex items-center gap-4 rounded-full border-2 border-[#A17E3C] hover:bg-[#A17E3C] hover:bg-opacity-10 transition-colors"
        >
          <p className="font-['Jost']">
            Safe mode {isSafeModeOn ? "on" : "off"}
          </p>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSafeModeOn
                ? "border-[#A17E3C] bg-[#A17E3C]"
                : "border-gray-400"
            }`}
          >
            {isSafeModeOn && (
              <div className="w-2 h-2 rounded-full bg-white"></div>
            )}
          </div>
        </button>
        <button
          type="button"
          onClick={onRefreshPosts}
          disabled={loading}
          className="p-2 md:p-2.5 rounded-lg bg-[#A17E3C] text-white hover:bg-[#8B6A32] transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCcw
            className={`w-4 h-4 md:w-5 md:h-5 ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default FeedHeader;