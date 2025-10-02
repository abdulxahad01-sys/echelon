import React, { useState } from 'react';
import { X } from 'lucide-react';

const ResolveReportDialog = ({ isOpen, onClose, onConfirm }) => {
  const [action, setAction] = useState('actioned');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(action, notes);
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#A17E3C] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-['Jost']">Resolve Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-4 font-['Jost']">
          Resolve this report and take appropriate action.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#E6D2A2] text-sm mb-2 font-['Jost']">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full p-3 bg-black/50 border border-[#A17E3C]/40 rounded-lg text-white font-['Jost']"
            >
              <option value="actioned">Actioned</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[#E6D2A2] text-sm mb-2 font-['Jost']">
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes about the resolution..."
              className="w-full p-3 bg-black/50 border border-[#A17E3C]/40 rounded-lg text-white font-['Jost'] resize-none"
              rows={3}
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
              className="flex-1 py-3 bg-[#A17E3C] text-white rounded-lg font-['Jost'] hover:bg-[#A17E3C]/80"
            >
              Resolve Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResolveReportDialog;