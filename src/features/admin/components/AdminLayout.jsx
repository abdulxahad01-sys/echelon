import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  ArrowLeft,
  Plus,
  Camera,
  User,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import logo from "../../../assets/echelon_logo.png";
import { AdminProvider } from "../../../contexts/AdminContext";
import AdminProtectedRoute from "../../../components/AdminProtectedRoute";
import { ToastContainer } from "../../../components/Toast";
import NotificationCenter from "../../../components/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: "/", icon: ArrowLeft, label: "Back To Home" },
    { path: "/admin/", icon: User, label: "Users" },
    { path: "/admin/report", icon: Plus, label: "Content Reports" },
    { path: "/admin/audit-log", icon: Camera, label: "Audit Logs" },
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    return location.pathname === path;
  };

  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <div className="flex h-screen bg-[#050505] text-white">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-64 flex-col border-r [border-image-source:linear-gradient(137.38deg,rgba(202,178,101,0.5)_0.77%,rgba(98,77,21,0.5)_99.02%)] [border-image-slice:1]">
            {/* Logo */}
            <div className="p-4 lg:p-5 h-20 md:h-24 flex items-center bg-[#050505] ">
              <div className="flex items-center gap-1">
                <img src={logo} alt="Echelon" className="size-8 lg:size-10" />
                <span className="text-lg lg:text-xl font-['IvyMode']">
                  Echelon
                </span>
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
                <span className="text-md lg:text-base font-['Jost']">
                  Logout
                </span>
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
            <div className="w-full h-20 md:h-24 border-b flex items-center justify-between px-4 md:px-6 [border-image-source:linear-gradient(137.38deg,rgba(202,178,101,0.5)_0.77%,rgba(98,77,21,0.5)_99.02%)] [border-image-slice:1]">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>

              {/* Page Title - Desktop & Mobile */}
              <div className="flex-1 lg:flex-none lg:p-1">
                {location.pathname === "/admin" || location.pathname === "/admin/"  ? (
                  <>
                    <h1 className="text-xl lg:text-3xl text-white font-['IvyMode'] mb-0 lg:mb-1">
                      Users
                    </h1>
                    <p className="text-sm lg:text-md text-white font-['Jost'] hidden lg:block">
                      Mange Users
                    </p>
                  </>
                ) : location.pathname === "/admin/report" ? (
                  <>
                    <h1 className="text-xl lg:text-3xl text-white font-['IvyMode'] mb-0 lg:mb-1">
                      Reports
                    </h1>
                    <p className="text-sm lg:text-md text-white font-['Jost'] hidden lg:block">
                      Mange Reports
                    </p>
                  </>
                ) : location.pathname === "/admin/audit-log" ? (
                  <>
                    <h1 className="text-xl lg:text-3xl text-white font-['IvyMode'] mb-0 lg:mb-1">
                      Audit Logs
                    </h1>
                    <p className="text-sm lg:text-md text-white font-['Jost'] hidden lg:block">
                      Mange Audit Logs
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>

              {/* Notifications */}
              <NotificationCenter />
            </div>

            <div className="p-8">
              {/* Dynamic Content Area */}
              <Outlet />
            </div>
          </div>
          <ToastContainer />
        </div>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}

export default Layout;
