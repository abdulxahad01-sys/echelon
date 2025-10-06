import React, { useEffect } from "react";
import { Settings } from "lucide-react";
import { useAdmin } from "../../../contexts/AdminContext";
import moment from "moment";

function AuditLogsPage() {
  const { auditLogs, loadAuditLogs, isLoading } = useAdmin();

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);


  const getActionTypeColor = (actionType) => {
    switch (actionType) {
      case 'ban_user':
      case 'delete_user':
      case 'delete_post':
        return 'text-red-400';
      case 'unban_user':
      case 'resolve_report':
        return 'text-green-400';
      case 'add_restriction':
        return 'text-yellow-400';
      default:
        return 'text-[#E6D2A2]';
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
      <h1 className='text-white text-xl sm:text-2xl font-["Jost"] mb-4 sm:mb-6'>Audit Logs</h1>

      <div className="space-y-3 sm:space-y-4">
        {auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 font-['Jost']">No audit logs found</p>
          </div>
        ) : auditLogs.map((log) => (
          <div key={log.id} className="w-full bg-black/50 rounded-xl border border-[#A17E3C] overflow-hidden">
            {/* Mobile Layout */}
            <div className="block lg:hidden p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#E6D2A233] rounded-full p-2 flex-shrink-0">
                  <Settings color="#E6D2A2" size={20} />
                </div>
                <h1 className='text-white text-sm font-medium font-["Jost"] truncate'>{log.action_type}</h1>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <h1 className="text-[#E6D2A2] font-['Jost']">From</h1>
                  <h1 className="text-white font-['Jost'] truncate">{log.actor?.full_name || 'System'}</h1>
                </div>
                <div>
                  <h1 className="text-[#E6D2A2] font-['Jost']">Date</h1>
                  <h1 className="text-white font-['Jost']">{moment(log.created_at).calendar()}</h1>
                </div>
              </div>
              <div>
                <h1 className="text-[#E6D2A2] font-['Jost'] text-xs sm:text-sm">Target</h1>
                <h1 className="text-white font-['Jost'] text-xs sm:text-sm">
                  {log.target_type} {log.target_id && `#${log.target_id.slice(0, 8)}`}
                </h1>
              </div>
              {log.details && (
                <div>
                  <h1 className="text-[#E6D2A2] font-['Jost'] text-xs sm:text-sm">Details</h1>
                  <pre className="text-white font-['Jost'] text-xs sm:text-sm whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
              <div className="flex justify-end">
                <div className={`w-fit px-4 py-1 text-xs sm:text-sm font-medium rounded-full border font-["Inter"] ${getActionTypeColor(log.action_type)} border-current`}>
                  {log.action_type}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex items-center">
                <div className="flex-1 py-4 px-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#E6D2A233] rounded-full p-3">
                      <Settings color="#E6D2A2" size={28} />
                    </div>
                    <h1 className='text-white text-base font-medium font-["Jost"] truncate'>{log.action_type}</h1>
                  </div>
                </div>
                <div className="flex-1 py-4 px-3">
                  <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">From</h1>
                  <h1 className="text-white font-['Jost'] truncate">{log.actor?.full_name || 'System'}</h1>
                </div>
                <div className="flex-1 py-4 px-3">
                  <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">Target</h1>
                  <h1 className="text-white font-['Jost']">
                    {log.target_type} {log.target_id && `#${log.target_id.slice(0, 8)}`}
                  </h1>
                </div>
                <div className="flex-2 py-4 px-3">
                  <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">Details</h1>
                  <div className="text-white font-['Jost'] truncate">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </div>
                </div>
                <div className="flex-1 py-4 px-3">
                  <h1 className="text-[#E6D2A2] font-['Jost'] text-sm">Date</h1>
                  <h1 className="text-white font-['Jost']">{moment(log.created_at).calendar()}</h1>
                </div>
                <div className="flex-1 py-4 px-3">
                  <div className={`w-fit px-6 py-1.5 text-base font-medium rounded-full border font-["Inter"] ${getActionTypeColor(log.action_type)} border-current`}>
                    {log.action_type}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditLogsPage;