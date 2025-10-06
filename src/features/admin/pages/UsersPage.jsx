import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useAdmin } from "../../../contexts/AdminContext";
import BanUserDialog from "../components/BanUserDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";
import UserAvatar from "@/features/portal/components/UserAvatar";

function UsersPage() {
  const { users, loadUsers, banUser, unbanUser, deleteUser, isLoading } =
    useAdmin();
  const [selectedUser, setSelectedUser] = useState(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleBanUser = async (reason, duration) => {
    if (selectedUser) {
      await banUser(selectedUser.id, reason, duration);
      loadUsers();
    }
  };

  const handleDeleteUser = async (reason) => {
    if (selectedUser) {
      await deleteUser(selectedUser.id, reason);
      loadUsers();
    }
  };

  const handleUnbanUser = async (userId) => {
    await unbanUser(userId);
    loadUsers();
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
      <h1 className='text-white text-xl sm:text-2xl font-["Jost"] mb-4'>
        User Management
      </h1>

      {/* Header - Hidden on mobile */}
      <div className="hidden md:grid w-full grid-cols-12 border-b border-[#323232] mb-2">
        <div className="col-span-6 p-4">
          <h1 className='text-white text-base font-medium font-["Jost"]'>
            Name
          </h1>
        </div>
        <div className="col-span-6 p-4">
          <h1 className='text-white text-base text-right font-medium font-["Jost"]'>
            Action
          </h1>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3 md:space-y-0">
        {users.map((user) => (
          <div
            key={user.id}
            className="w-full md:grid md:grid-cols-12 border-b border-[#323232] bg-black/20 md:bg-transparent rounded-lg md:rounded-none p-3 md:p-0"
          >
            {/* User Info */}
            <div className="md:col-span-6 md:p-2.5">
              <div className="flex items-center gap-3 sm:gap-4">
                {user.avatar_url !== null ? (
                  <img
                    src={user.avatar_url || "/placeholder-avatar.png"}
                    alt={user.full_name || "User"}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 object-cover flex-shrink-0"
                  />
                ) : (
                  <UserAvatar />
                )}

                <div className="min-w-0 flex-1">
                  <h1 className='text-white text-sm sm:text-base font-medium font-["Jost"] truncate'>
                    {user.full_name || "Unknown"}
                  </h1>
                  <p className='text-white text-xs sm:text-sm font-["Jost"] truncate'>
                    {user.handle || user.email}
                  </p>
                  {user.is_banned && (
                    <span className="text-red-400 text-xs font-['Jost']">
                      Banned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-6 md:p-2.5 mt-3 md:mt-0">
              <div className="flex flex-col sm:flex-row md:justify-end gap-2 sm:gap-3">
                {user.is_banned ? (
                  <button
                    onClick={() => handleUnbanUser(user.id)}
                    className='flex-1 sm:w-32 lg:w-40 text-center h-10 sm:h-12 text-green-400 border border-green-400 text-sm sm:text-base font-medium rounded-lg font-["Jost"] cursor-pointer hover:bg-green-400/10'
                  >
                    Unban User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setBanDialogOpen(true);
                    }}
                    className='flex-1 sm:w-32 lg:w-40 text-center h-10 sm:h-12 text-[#A17E3C] text-sm sm:text-base font-medium rounded-lg border border-[#A17E3C] font-["Jost"] cursor-pointer hover:bg-[#A17E3C]/10'
                  >
                    Ban User
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setDeleteDialogOpen(true);
                  }}
                  className='flex-1 sm:w-32 lg:w-40 text-center h-10 sm:h-12 text-white bg-[#A17E3C] text-sm sm:text-base rounded-lg border border-[#A17E3C] font-medium font-["Jost"] cursor-pointer hover:bg-[#A17E3C]'
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BanUserDialog
        isOpen={banDialogOpen}
        onClose={() => {
          setBanDialogOpen(false);
          setSelectedUser(null);
          loadUsers();
        }}
        onConfirm={handleBanUser}
        user={selectedUser}
      />

      <DeleteUserDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
          loadUsers();
        }}
        onConfirm={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
}

export default UsersPage;
