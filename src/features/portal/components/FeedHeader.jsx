import { RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function FeedHeader({
  isSafeModeOn,
  onToggleSafeMode,
  onRefreshPosts,
  loading,
}) {
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
        console.error("Error updating safe mode:", error);
        // Revert UI change on error
        onToggleSafeMode();
      }
    }
  };
  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 py-3 sm:py-4 md:py-5 lg:py-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold font-['Jost'] text-white">
        Community Feed
      </h1>
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-start sm:justify-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Safe Mode Button */}
        <button
          onClick={handleSafeModeToggle}
          className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2 flex items-center justify-between sm:justify-center gap-3 sm:gap-4 rounded-full border-2 border-[#A17E3C] hover:bg-[#A17E3C]/10 transition-colors"
        >
          <p className="font-['Jost'] text-sm sm:text-base whitespace-nowrap">
            Safe mode {isSafeModeOn ? "on" : "off"}
          </p>
          <div
            className={`size-5 rounded-full border-2 flex items-center justify-center ${
              isSafeModeOn ? "border-[#A17E3C] bg-[#A17E3C]" : "border-gray-400"
            }`}
          >
            {isSafeModeOn && <div className="size-2 rounded-full bg-white" />}
          </div>
        </button>
        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefreshPosts}
          disabled={loading}
          className="p-2 sm:p-2.5 rounded-lg bg-[#A17E3C] text-white hover:bg-[#8B6A32] transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto flex justify-center"
        >
          <RefreshCcw
            className={`size-4 sm:size-5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

export default FeedHeader;