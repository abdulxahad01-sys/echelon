import UserAvatar from "./UserAvatar";

function CreatePostPrompt({ onNavigateToCreatePost }) {
  return (
    <div
      onClick={onNavigateToCreatePost}
      className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden flex items-center py-4 md:py-5 lg:py-6 cursor-pointer"
    >
      <div className="mr-4">
        <UserAvatar
          src={null}
          alt="Your Avatar"
          size="lg"
        />
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="What's on your mind?"
          readOnly
          className="w-full px-7 py-2.5 bg-transparent rounded-full border border-[#A17E3C] text-white placeholder:text-white text-sm md:text-md focus:outline-none font-['Jost'] cursor-pointer"
        />
      </div>
    </div>
  );
}

export default CreatePostPrompt;