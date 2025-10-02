import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  ArrowLeft,
  Home,
  Plus,
  Camera,
  MessageCircle,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
} from "lucide-react";
import logo from "../../../assets/echelon_logo.png";
import NotificationCenter from "../../../components/NotificationCenter";
import { profileService } from "../services/profileService";
import { useAuth } from "@/contexts/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const displayUsers = userSearch.trim() ? userResults : allUsers;

  const loadAllUsers = async () => {
    try {
      const users = await profileService.loadAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  // Search users effect
  useEffect(() => {
    const q = userSearch.trim();
    if (!q) {
      setUserResults([]);
      if (searchFocused && allUsers.length === 0) {
        loadAllUsers();
      }
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const users = await profileService.searchUsers(q);

        setUserResults(users);
      } catch (error) {
        console.error("Error searching users:", error);
        setUserResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [userSearch, searchFocused]);

  const navigationItems = [
    { path: "/", icon: ArrowLeft, label: "Back To Home" },
    { path: "/portal", icon: Home, label: "Feed" },
    { path: "/portal/create-post", icon: Plus, label: "Create Post" },
    { path: "/portal/create-story", icon: Camera, label: "Create Story" },
    { path: "/portal/chats", icon: MessageCircle, label: "Messages" },
    { path: "/portal/profile", icon: User, label: "My Profile" },
  ];

  const isActive = (path) => {
    if (path === "/portal" && location.pathname === "/portal") return true;
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-col border-r [border-image-source:linear-gradient(137.38deg,rgba(202,178,101,0.5)_0.77%,rgba(98,77,21,0.5)_99.02%)] [border-image-slice:1]">
        {/* Logo */}
        <div className="p-4 lg:p-5 bg-[#050505] ">
          <div className="flex items-center gap-1">
            <img src={logo} alt="Echelon" className="size-8 lg:size-10" />
            <span className="text-lg lg:text-xl font-['IvyMode']">Echelon</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 bg-[#050505]">
          <div className="p-4 border-y [border-image-source:linear-gradient(90deg,rgba(153,153,153,0)_0.96%,#ffffff_52.4%,#ffffff_52.41%,rgba(153,153,153,0)_100%)] [border-image-slice:1]">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-full transition-colors mb-4 cursor-pointer font-['Jost'] ${
                    isActive(item.path)
                      ? "bg-zinc-800 hover:bg-bg-white/15 [box-shadow:2px_2px_4px_0px_#00000040]"
                      : "hover:bg-white/10 [box-shadow:2px_2px_4px_0px_#00000040]"
                  }`}
                >
                  <IconComponent
                    size={22}
                    color="#A17E3C"
                    className="lg:size-5"
                  />
                  <span className="text-md lg:text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Desktop Logout */}
        <div className="p-4 py-6 bg-[#050505]">
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <LogOut size={22} color="#A17E3C" className="lg:size-5" />
            <span className="text-md lg:text-base font-['Jost']">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Echelon" className="size-6" />
            <span className="text-lg font-['IvyMode']">Echelon</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors mb-2 rounded-full cursor-pointer ${
                  isActive(item.path)
                    ? "bg-zinc-800 hover:bg-bg-white/15 [box-shadow:2px_2px_4px_0px_#00000040]"
                    : "hover:bg-zinc-800"
                }`}
              >
                <IconComponent size={20} color="#A17E3C" />
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <LogOut size={20} color="#A17E3C" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="w-full h-16 md:h-20 border-b flex items-center justify-between px-2 sm:px-4 md:px-6 [border-image-source:linear-gradient(137.38deg,rgba(202,178,101,0.5)_0.77%,rgba(98,77,21,0.5)_99.02%)] [border-image-slice:1]">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Mobile Logo - Hidden on small screens when search is active */}
          <div className={`lg:hidden flex items-center gap-2 transition-all duration-200 ${
            searchFocused ? 'hidden sm:flex' : 'flex'
          }`}>
            <img src={logo} alt="Echelon" className="size-5 sm:size-6" />
            <span className="text-base sm:text-lg font-['IvyMode']">Echelon</span>
          </div>

          {/* Search Container */}
          <div className={`relative flex items-center transition-all duration-200 ${
            searchFocused 
              ? 'flex-1 mx-2 sm:mx-4 md:w-96 md:flex-none' 
              : 'w-32 sm:w-48 md:w-64 lg:w-80'
          }`}>
            <div className="w-full relative flex items-center h-9 sm:h-10 px-3 sm:px-4 rounded-full border border-[#CAB265]/70 bg-black/60">
              <Search className="size-3 sm:size-4 text-[#A17E3C] mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder={searchFocused ? "Search members..." : "Search"}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                  if (!userSearch.trim() && allUsers.length === 0) {
                    loadAllUsers();
                  }
                }}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder:text-[#8D8D8D] outline-none font-['Jost'] min-w-0"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {searchFocused && (displayUsers.length > 0 || searchingUsers) && (
              <div className="absolute top-11 sm:top-12 left-0 right-0 bg-[#1a1a1a] border border-[#A17E3C]/40 rounded-lg shadow-lg z-50 max-h-60 sm:max-h-80 overflow-auto">
                {searchingUsers && (
                  <div className="p-2 sm:p-3 text-xs sm:text-sm text-white/70 font-['Jost']">
                    Searching...
                  </div>
                )}
                {!searchingUsers &&
                  displayUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-2 sm:p-3 hover:bg-white/5 cursor-pointer flex items-center space-x-2 sm:space-x-3 border-b border-[#A17E3C]/10 last:border-b-0"
                      onClick={() => {
                        navigate(`/portal/profile/${u.id}`);
                        setSearchFocused(false);
                        setUserSearch("");
                      }}
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#A17E3C] flex items-center justify-center text-white text-xs sm:text-sm font-['Jost'] flex-shrink-0">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt={u.full_name}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                          />
                        ) : (
                          u.full_name?.charAt(0) || "?"
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 font-['Jost'] min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {u.full_name || u.handle || "Unknown"}
                        </div>
                        {u.handle && (
                          <div className="text-xs text-white/60 truncate">
                            @{u.handle}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                {!searchingUsers && displayUsers.length === 0 && (
                  <div className="p-2 sm:p-3 text-xs sm:text-sm text-white/70 font-['Jost']">
                    No members found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="flex-shrink-0">
            <NotificationCenter />
          </div>
        </div>

        <div>
          {/* Dynamic Content Area */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
