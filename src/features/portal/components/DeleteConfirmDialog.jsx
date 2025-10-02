import { Trash2 } from "lucide-react";

function DeleteConfirmDialog({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg p-6 max-w-md w-full border border-red-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-500/20 p-2 rounded-full">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg font-['IvyMode']">Delete Post</h3>
            <p className="text-white/60 text-sm font-['Jost']">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-white/80 mb-6 font-['Jost']">
          Are you sure you want to delete this post? This will permanently remove it from your profile and all associated data.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-white/20 text-white hover:bg-white/10 py-2 px-4 rounded-lg transition-colors font-['Jost'] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-['Jost'] disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;