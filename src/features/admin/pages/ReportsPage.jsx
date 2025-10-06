import React, { useState, useEffect } from "react";
import { useAdmin } from "../../../contexts/AdminContext";
import ResolveReportDialog from "../components/ResolveReportDialog";
import ViewPostDialog from "../components/ViewPostDialog";
import moment from "moment";
import UserAvatar from "@/features/portal/components/UserAvatar";

function ReportsPage() {
  const { reports, loadReports, resolveReport, deletePost, isLoading } =
    useAdmin();
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [viewPostDialogOpen, setViewPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleResolveReport = async (action, notes) => {
    if (selectedReport) {
      await resolveReport(selectedReport.id, action, notes);
      loadReports();
    }
  };

  const handleDeletePost = async (report) => {
    if (report.reported_post?.id) {
      await deletePost(report.reported_post.id, "Deleted by admin from report");
      await resolveReport(report.id, "actioned", "Post deleted");
      loadReports();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A17E3C]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#A17E3C]/40">
      <h1 className='text-white text-xl sm:text-2xl font-["Jost"] mb-4 sm:mb-6'>
        Content Reports
      </h1>

      <div className="space-y-3 sm:space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 font-['Jost']">No reports found</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="w-full bg-black/50 rounded-xl border border-[#A17E3C] overflow-hidden"
            >
              {/* Mobile Layout */}
              <div className="block xl:hidden p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={report.reported_user.avatar_url}
                    alt={report.reporter?.full_name}
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <h1 className='text-white text-sm sm:text-base font-medium font-["Jost"] truncate'>
                      {report.reporter?.full_name || "Unknown"}
                    </h1>
                    <p className='text-white text-xs sm:text-sm font-["Jost"] truncate'>
                      @{report.reporter?.handle || report.reporter?.email}
                    </p>
                    <span
                      className={`text-xs font-['Jost'] ${
                        report.status === "open"
                          ? "text-yellow-400"
                          : report.status === "actioned"
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <h1 className="text-[#E6D2A2] font-['Jost']">
                      Reported: {report.reported_user ? "User" : "Post"}
                    </h1>
                    <h1 className="text-white font-['Jost'] truncate">
                      {report.reported_user?.full_name ||
                        report.reported_post?.content?.substring(0, 30) +
                          "..." ||
                        "Unknown"}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-[#E6D2A2] font-['Jost']">Reason</h1>
                    <h1 className="text-white font-['Jost'] truncate">
                      {report.reason}
                    </h1>
                  </div>
                  <div className="sm:col-span-2">
                    <h1 className="text-[#E6D2A2] font-['Jost']">
                      Reported on
                    </h1>
                    <h1 className="text-white font-['Jost']">
                      {moment(report.created_at).calendar()}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {report.reported_post && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedPost(report.reported_post);
                          setViewPostDialogOpen(true);
                        }}
                        className='flex-1 text-center h-10 sm:h-12 text-[#A17E3C] text-sm sm:text-base font-medium rounded-lg border border-[#A17E3C] font-["Jost"] cursor-pointer hover:bg-[#A17E3C]/10'
                      >
                        View Post
                      </button>
                      <button
                        onClick={() => handleDeletePost(report)}
                        className='flex-1 text-center h-10 sm:h-12 text-red-400 border border-red-400 text-sm sm:text-base font-medium rounded-lg font-["Jost"] cursor-pointer hover:bg-red-400/10'
                      >
                        Delete Post
                      </button>
                    </>
                  )}
                  {report.status === "open" && (
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setResolveDialogOpen(true);
                      }}
                      className='flex-1 text-center h-10 sm:h-12 text-white bg-[#A17E3C] text-sm sm:text-base rounded-lg border border-[#A17E3C] font-medium font-["Jost"] cursor-pointer hover:bg-[#A17E3C]/80'
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden xl:block">
                <div className="flex items-center">
                  <div className="flex-1 py-4 px-5">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        src={report.reported_user.avatar_url}
                        alt={report.reporter?.full_name}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <h1 className='text-white text-base font-medium font-["Jost"] truncate'>
                          {report.reporter?.full_name || "Unknown"}
                        </h1>
                        <p className='text-white text-sm font-["Jost"] truncate'>
                          @{report.reporter?.handle || report.reporter?.email}
                        </p>
                        <span
                          className={`text-xs font-['Jost'] ${
                            report.status === "open"
                              ? "text-yellow-400"
                              : report.status === "actioned"
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-4 px-3">
                    <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">
                      Reported Content
                    </h1>
                    <h1 className="text-white font-['Jost'] truncate">
                      {report.reported_user?.full_name ||
                        report.reported_post?.content?.substring(0, 30) +
                          "..." ||
                        "Unknown"}
                    </h1>
                  </div>
                  <div className="flex-1 py-4 px-3">
                    <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">
                      Reason
                    </h1>
                    <h1 className="text-white font-['Jost'] truncate">
                      {report.reason}
                    </h1>
                  </div>
                  <div className="flex-1 py-4 px-3">
                    <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">
                      Reported on
                    </h1>
                    <h1 className="text-white font-['Jost']">
                      {moment(report.created_at).calendar()}
                    </h1>
                  </div>
                  <div className="flex-1 py-4 px-3">
                    <div className="flex justify-end gap-3">
                      {report.reported_post && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPost(report.reported_post);
                              setViewPostDialogOpen(true);
                            }}
                            className='w-32 lg:w-40 text-center h-12 text-[#A17E3C] text-base font-medium rounded-lg border border-[#A17E3C] font-["Jost"] cursor-pointer hover:bg-[#A17E3C]/10'
                          >
                            View Post
                          </button>
                          <button
                            onClick={() => handleDeletePost(report)}
                            className='w-32 lg:w-40 text-center h-12 text-red-400 border border-red-400 text-base font-medium rounded-lg font-["Jost"] cursor-pointer hover:bg-red-400/10'
                          >
                            Delete Post
                          </button>
                        </>
                      )}
                      {report.status === "open" && (
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setResolveDialogOpen(true);
                          }}
                          className='w-32 lg:w-40 text-center h-12 text-white bg-[#A17E3C] text-base rounded-lg border border-[#A17E3C] font-medium font-["Jost"] cursor-pointer hover:bg-[#A17E3C]/80'
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ResolveReportDialog
        isOpen={resolveDialogOpen}
        onClose={() => {
          setResolveDialogOpen(false);
          setSelectedReport(null);
          loadReports();
        }}
        onConfirm={handleResolveReport}
        report={selectedReport}
      />

      <ViewPostDialog
        isOpen={viewPostDialogOpen}
        onClose={() => {
          setViewPostDialogOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />
    </div>
  );
}

export default ReportsPage;
