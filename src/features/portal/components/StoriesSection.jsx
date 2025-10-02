import { Plus } from "lucide-react";
import UserAvatar from "./UserAvatar";

function StoriesSection({
  userStories,
  stories,
  currentUserId,
  onUserStoryClick,
  onPublicStoryClick,
}) {

  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden flex items-center py-4 md:py-5 lg:py-6">
      <div
        onClick={onUserStoryClick}
        className="size-20 aspect-square rounded-full border border-[#A17E3C] p-1 mr-4 flex items-center justify-center cursor-pointer"
      >
        {userStories.length > 0 ? (
          <UserAvatar
            src={userStories[0].profiles?.avatar_url}
            alt="Your Story"
            className="size-full"
            size="xl"
          />
        ) : (
          <div className="size-10 mx-auto rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#3B82F6] to-[#9333EA]">
            <Plus />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto">
        {stories
          .filter((story) => story.author_id !== currentUserId)
          .map((story) => (
            <div
              key={story.id}
              onClick={() => onPublicStoryClick(story)}
              className="size-20 rounded-full border border-[#A17E3C] p-0.5 mr-4 flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <UserAvatar
                src={story.profiles?.avatar_url}
                alt={story.profiles?.full_name}
                className="size-full"
                size="xl"
              />
            </div>
          ))}
        {stories.filter((story) => story.author_id !== currentUserId).length ===
          0 && (
          <div className="text-[#8D8D8D] text-sm font-['Jost']">
            No stories available
          </div>
        )}
      </div>
    </div>
  );
}

export default StoriesSection;
