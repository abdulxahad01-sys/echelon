import { useState } from "react";
import { Flag, X } from "lucide-react";
import { reportService } from "../services/reportService";

const REPORT_REASONS = [
  "Inappropriate Content",
  "Harassment or Bullying", 
  "Spam or Scam",
  "Violence or Threats",
  "Hate Speech",
  "Nudity or Sexual Content",
  "Impersonation",
  "Copyright Violation",
  "Other"
];

function ReportModal({ 
  isOpen,
  onClose,
  reportedUserId, 
  reportedPostId,
  onReportSubmitted 
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) return;
    

    setLoading(true);

    try {
      await reportService.submitReport({
        reportedUserId,
        reportedPostId,
        reason,
        description: description.trim() || null
      });

      console.log("Report submitted successfully");
      
      setReason("");
      setDescription("");
      onClose();
      
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (error) {
      console.error("Error submitting report:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getReportType = () => {
    if (reportedUserId && reportedPostId) {
      return "post and user";
    } else if (reportedUserId) {
      return "user";
    } else if (reportedPostId) {
      return "post";
    }
    return "content";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#CAB265] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#CAB265]">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#CAB265]" />
            <h2 className="text-[#CAB265] font-['IvyMode'] text-xl">
              Report {getReportType()}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8D8D8D] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <p className="text-white/70 font-['Jost'] text-sm">
            Help us keep the community safe by reporting inappropriate content.
          </p>
          
          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-white font-['Jost'] text-sm">Reason for reporting</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-[#CAB265]/30 rounded-lg text-white font-['Jost'] text-sm focus:outline-none focus:border-[#CAB265]"
            >
              <option value="" className="bg-black">Select a reason...</option>
              {REPORT_REASONS.map((reportReason) => (
                <option 
                  key={reportReason} 
                  value={reportReason}
                  className="bg-black text-white"
                >
                  {reportReason}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Description */}
          <div className="space-y-2">
            <label className="text-white font-['Jost'] text-sm">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context that might help us understand the issue..."
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 bg-transparent border border-[#CAB265]/30 rounded-lg text-white placeholder-[#8D8D8D] font-['Jost'] text-sm focus:outline-none focus:border-[#CAB265] resize-none"
            />
            <p className="text-[#8D8D8D] text-xs font-['Jost']">{description.length}/500 characters</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#CAB265] text-[#CAB265] rounded-lg hover:bg-[#CAB265]/10 transition-colors font-['Jost'] text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-['Jost'] text-sm disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;