import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { postService } from "../services/postService";
import Modal from "../../../components/ui/Modal";

function CreateNewPost() {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNSFW, setIsNSFW] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "" });

  const { user, subscribed } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Authentication Required",
        message: "You must be logged in to create a post."
      });
      return;
    }

    if (!subscribed) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Subscription Required",
        message: "You need an active subscription to create posts."
      });
      return;
    }

    if (!content.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Content Required",
        message: "Please add some content to your post."
      });
      return;
    }

    setLoading(true);

    try {
      await postService.createPost({
        userId: user.id,
        content,
        image: selectedFile,
        isNsfw: isNSFW
      });

      setModal({
        isOpen: true,
        type: "success",
        title: "Post Created Successfully!",
        message: "Your post has been shared with the Echelon Texas community."
      });

      // Reset form
      setContent("");
      setSelectedFile(null);
      setIsNSFW(false);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Post Creation Failed",
        message: error.message || "An error occurred while creating your post. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };

  return (
    <div className="flex items-center justify-center h-[90vh] p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl bg-transparent p-4 md:p-6 lg:p-8 relative">
        {/* Gradient border using pseudo-element */}
        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-[rgba(202,178,101,0.5)] to-[rgba(98,77,21,0.5)] p-[1px]">
          <div className="w-full h-full bg-black rounded-xl md:rounded-2xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-['IvyMode'] font-medium mb-2">Create New Post</h1>
          <p className="text-white text-xs md:text-sm mb-4 md:mb-6 font-['Jost']">
            Share your thoughts with the Echelon Texas community
          </p>

          {/* Content Textarea */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-md mb-2 font-['Jost']">Content</label>
            <div className="rounded-lg bg-gradient-to-br from-[rgba(202,178,101,0.5)] to-[rgba(98,77,21,0.5)] p-[1px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts with the Echelon Texas community"
                className="w-full h-24 md:h-32 bg-zinc-950 border-0 rounded-lg px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none transition-colors resize-none font-['Jost']"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-md mb-2 font-['Jost']">Image (Optional)</label>
            <div className="rounded-lg bg-gradient-to-br from-[rgba(202,178,101,0.5)] to-[rgba(98,77,21,0.5)] p-[1px]">
              <div className="bg-black rounded-lg p-1 md:p-1.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <label className="px-4 md:px-6 py-2 md:py-2.5 bg-[#A17E3C] hover:bg-[#8B6B32] rounded-lg cursor-pointer transition-colors">
                    <span className="text-sm md:text-md font-['Jost']">Choose File</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm md:text-md text-zinc-400 break-all font-['Jost']">
                    {selectedFile ? selectedFile.name : "No File Chosen"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NSFW Toggle */}
          <div className="mb-4 md:mb-6">
            <label className="flex items-center gap-2 md:gap-2.5 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isNSFW}
                  onChange={(e) => setIsNSFW(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isNSFW
                      ? "bg-[#A17E3C] border-[#A17E3C]"
                      : "border-zinc-600"
                  }`}
                >
                  {isNSFW && (
                    <svg
                      className="w-2.5 h-2.5 md:w-3 md:h-3 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm md:text-md font-['Jost']">
                Mark as NSFW (Not Safe For Work)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 md:py-3 bg-[#A17E3C] hover:bg-[#8B6B32] rounded-lg transition-colors cursor-pointer text-sm md:text-base font-['Jost']"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        <p className="text-gray-700 font-['Jost']">{modal.message}</p>
      </Modal>
    </div>
  );
}

export default CreateNewPost;