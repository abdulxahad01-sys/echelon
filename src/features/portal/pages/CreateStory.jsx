import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { storyService } from "../services/storyService";

function CreateStory() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNSFW, setIsNSFW] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "" });

  const MAX_CHARS = 5000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File size exceeds 5MB limit");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload JPEG, PNG, GIF, or MP4");
      return;
    }

    setSelectedFile(file);
    setMediaType(file.type.startsWith("image") ? "image" : "video");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setSelectedFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setUploadError("");
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Authentication Required",
        message: "You must be logged in to create a story."
      });
      return;
    }

    if (!content.trim() && !selectedFile) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Content Required",
        message: "Please add some content or media to your story."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await storyService.createStory({
        userId: user.id,
        userEmail: user.email,
        content,
        image: selectedFile,
        isNsfw: isNSFW
      });

      setModal({
        isOpen: true,
        type: "success",
        title: "Story Created Successfully!",
        message: "Your story has been shared and will be visible for 24 hours."
      });

      // Reset form
      setContent("");
      setSelectedFile(null);
      setMediaPreview(null);
      setMediaType(null);
      setIsNSFW(false);
      setUploadError("");
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Story Creation Failed",
        message: error.message || "An error occurred while creating your story. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to clear this story?")) {
      setContent("");
      setSelectedFile(null);
      setMediaPreview(null);
      setMediaType(null);
      setIsNSFW(false);
      setUploadError("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 min-h-screen bg-black text-white">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl py-4 md:py-6 lg:py-8">
        <h1 className="text-3xl md:text-4xl font-medium mb-2 font-['IvyMode']">
          Create New Story
        </h1>
        <p className="text-white text-xs md:text-sm mb-4 md:mb-6 font-['Jost']">
          Share a moment that disappears in 24 hours
        </p>
      </div>

      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl bg-transparent p-4 md:p-6 lg:p-8 relative">
        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-[rgba(202,178,101,0.5)] to-[rgba(98,77,21,0.5)] p-[1px]">
          <div className="w-full h-full bg-black rounded-xl md:rounded-2xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-medium mb-2 font-['IvyMode']">New Story</h1>
          <p className="text-[#8D8D8D] text-sm md:text-md mb-4 md:mb-6 font-['Jost']">
            Your story will be visible to other members for 24 hours
          </p>

          {/* Media Upload */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-md mb-2 font-['Jost']">
              Add Media (Optional)
            </label>
            <div className="rounded-lg flex flex-col items-center justify-center border border-dashed border-[#A17E3C] p-4">
              {mediaPreview ? (
                <div className="relative w-full">
                  {mediaType === "image" ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full max-h-64 rounded-lg"
                    />
                  )}
                  <button
                    onClick={handleRemoveMedia}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="size-40 bg-zinc-900 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-16 h-16 text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <label className="w-fit py-2.5 md:py-3 px-3.5 md:px-5 mx-auto border border-[#A17E3C] text-[#8B6B32] hover:bg-[#A17E3C] hover:text-white rounded-lg transition-colors cursor-pointer text-sm md:text-base font-['Jost']">
                    Upload Image or Video
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif,video/mp4"
                      className="hidden"
                    />
                  </label>
                </>
              )}
              {uploadError && (
                <p className="text-red-500 text-sm mt-2">{uploadError}</p>
              )}
              <p className="text-[#8D8D8D] text-sm md:text-md mt-2 font-['Jost']">
                Supports JPEG, PNG, GIF, MP4 up to 50MB
              </p>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-md mb-2 font-['Jost']">
              Story Content
            </label>
            <div className="rounded-lg bg-gradient-to-br from-[rgba(202,178,101,0.5)] to-[rgba(98,77,21,0.5)] p-[1px]">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="What's happening? Share your moment..."
                className="w-full h-24 md:h-32 bg-zinc-950 border-0 rounded-lg px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none transition-colors resize-none font-['Jost']"
              />
            </div>
            <p
              className={`text-sm md:text-md flex justify-end mt-1 font-['Jost'] ${
                content.length >= MAX_CHARS ? "text-red-500" : "text-[#A17E3C]"
              }`}
            >
              {content.length}/{MAX_CHARS} characters
            </p>
          </div>

          {/* File Upload (Secondary) */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-md mb-2 font-['Jost']">
              Alternative Upload
            </label>
            <div className="rounded-lg bg-gradient-to-br from-[rgba(202,178,101,0.5)] to-[rgba(98,77,21,0.5)] p-[1px]">
              <div className="bg-black rounded-lg p-1 md:p-1.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <label className="px-4 md:px-6 py-2 md:py-2.5 bg-[#A17E3C] hover:bg-[#8B6B32] rounded-lg cursor-pointer transition-colors">
                    <span className="text-sm md:text-md font-['Jost']">Choose File</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif,video/mp4"
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
                    isNSFW ? "bg-[#A17E3C] border-[#A17E3C]" : "border-zinc-600"
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

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-full py-2.5 md:py-3 border border-[#A17E3C] text-[#8B6B32] hover:bg-[#8B6B32] hover:text-white rounded-lg transition-colors cursor-pointer text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed font-['Jost']"
            >
              Delete Story
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && !selectedFile)}
              className="w-full py-2.5 md:py-3 bg-[#A17E3C] border border-[#A17E3C] hover:bg-[#8B6B32] rounded-lg transition-colors cursor-pointer text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed font-['Jost']"
            >
              {isSubmitting ? "Creating..." : "Create Story"}
            </button>
          </div>
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

export default CreateStory;