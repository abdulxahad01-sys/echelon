import React from 'react';
import { X } from 'lucide-react';

const ViewPostDialog = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#A17E3C] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-['Jost']">Reported Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-4 font-['Jost']">
          Preview the reported content before taking action.
        </p>

        {post ? (
          <div className="space-y-3">
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post"
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            )}
            {post.content && (
              <p className="text-white text-sm font-['Jost']">{post.content}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm font-['Jost']">No post content available.</p>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[#A17E3C] border border-[#A17E3C] rounded-lg font-['Jost'] hover:bg-[#A17E3C]/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPostDialog;