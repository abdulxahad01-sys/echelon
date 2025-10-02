import logo from "../assets/echelon_logo.png";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="w-[95%] md:w-[90%] mx-auto mt-4 md:mt-6 relative z-[9999]">
      <div className="h-14 md:h-16 flex justify-between items-center px-4 md:px-8 rounded-xl md:rounded-2xl text-white">
        {/* Logo */}
        <div className="flex justify-center items-center">
          <img src={logo} alt="logo" className="w-8 h-auto md:w-10 object-contain" />
          <h1 className="text-xl md:text-2xl font-['IvyMode']">Echelon</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 xl:gap-8 font-['Jost']">
          <div
            className="text-base xl:text-lg hover:text-[#A17E3C] cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div
            className="text-base xl:text-lg hover:text-[#A17E3C] cursor-pointer transition-colors"
            onClick={() => navigate("/membership")}
          >
            Membership
          </div>
          <div
            className="text-base xl:text-lg hover:text-[#A17E3C] cursor-pointer transition-colors"
            onClick={() => navigate("/portal")}
          >
            Member Portal
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className="bg-[#A17E3C] hover:bg-[#8B6B32] text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-md font-['Jost'] transition-colors shadow-md cursor-pointer"
            onClick={() => navigate(user ? "/portal" : "/signin")}
          >
            {user ? "Portal" : "Join now"}
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-10 left-0 right-0 bg-black/50 backdrop-blur-md rounded-xl mt-2 p-4 text-white"
        >
          <div className="flex flex-col space-y-4 font-['Jost']">
            <div
              className="text-lg hover:text-[#A17E3C] cursor-pointer transition-colors py-2 border-b border-white/20"
              onClick={() => navigate("/")}
            >
              Home
            </div>
            <div
              className="text-lg hover:text-[#A17E3C] cursor-pointer transition-colors py-2 border-b border-white/20"
              onClick={() => navigate("/membership")}
            >
              Membership
            </div>
            <div
              className="text-lg hover:text-[#A17E3C] cursor-pointer transition-colors py-2 border-b border-white/20"
              onClick={() => navigate("/portal")}
            >
              Member Portal
            </div>

            <button
              className="bg-[#A17E3C] hover:bg-[#8B6B32] text-white px-6 py-3 rounded-xl text-md font-['Jost'] transition-colors shadow-md mt-4 cursor-pointer"
              onClick={() => navigate(user ? "/portal" : "/signin")}
            >
              {user ? "Portal" : "Join now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
