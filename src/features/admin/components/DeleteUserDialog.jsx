import React, { useState } from 'react';
import { X } from 'lucide-react';

const DeleteUserDialog = ({ isOpen, onClose, onConfirm, user }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#A17E3C] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-['Jost']">Delete User Account</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-4 font-['Jost']">
          Are you sure you want to delete this account? This action will permanently remove the user and all their data. This cannot be undone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#E6D2A2] text-sm mb-2 font-['Jost']">
              Reason for deletion
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for deletion..."
              className="w-full p-3 bg-black/50 border border-[#A17E3C]/40 rounded-lg text-white font-['Jost']"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-[#A17E3C] border border-[#A17E3C] rounded-lg font-['Jost'] hover:bg-[#A17E3C]/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-['Jost'] hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUserDialog;