import { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import logo from "../../../assets/echelon_logo.png";
import bgImage from "../../../assets/01. Gatehouse Complex View.webp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Modal from "../../../components/ui/Modal";

/**
 * SigninPage Component
 * 
 * A responsive signin page with:
 * - Two-column layout on desktop (logo + form)
 * - Single column layout on mobile/tablet
 * - Background image with glassmorphism effect
 * - Form validation and password visibility toggle
 * - Consistent container sizing with SignupPage
 */
function SigninPage() {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "" });
  const [errors, setErrors] = useState({});
  
  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // Navigation hook and auth context
  const navigate = useNavigate();
  const { signIn, user, profile, subscriptionLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    // Only redirect if we have user and profile, and subscription check is complete
    if (user && profile && !subscriptionLoading) {
      
      // Check if user is admin
      if (user.email === 'anthonytaye@gmail.com') {
        navigate("/admin", { replace: true });
        return;
      }
      
      // Use navigate_to_portfolio to determine redirect destination
      if (profile.navigate_to_portfolio) navigate("/portal", { replace: true });
      else navigate("/membership", { replace: true });
      
    } 
  }, [user, profile, subscriptionLoading, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      // Don't navigate here - let the useEffect handle it when user state updates
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Login Failed",
        message: error.message || "Invalid email or password. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };

  return (
    // Main container with background image
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main form container - responsive width matching SignupPage */}
      <div className="w-[95%] md:w-[85%] lg:w-[75%] grid grid-cols-1 lg:grid-cols-2 rounded-xl lg:rounded-2xl overflow-hidden">
        
        {/* Left side - Logo section (hidden on mobile/tablet) */}
        <div className="hidden lg:block lg:col-span-1 bg-white/10 backdrop-blur-md">
          <div className="size-full flex justify-center items-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <img src={logo} alt="Echelon" className="w-32 h-auto xl:w-52 object-contain" />
              <h1 className="text-4xl xl:text-6xl font-['IvyMode'] text-white ml-2">
                Echelon
              </h1>
            </div>
          </div>
        </div>
        
        {/* Right side - Form section */}
        <div className="col-span-1">
          <div className="relative z-10 w-full">
            <div className="bg-black p-6 md:p-6 lg:p-8 py-8 md:py-16 lg:py-24">
              
              {/* Close button */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 cursor-pointer"  onClick={() => navigate("/")}>
                <X color="#ffffff" size={24} className="md:w-7 md:h-7" />
              </div>

              {/* Mobile logo (visible only on mobile/tablet) */}
              <div className="lg:hidden flex flex-col items-center mb-8">
                <img src={logo} alt="Echelon" className="w-16 h-auto md:w-20 object-contain" />
                <h1 className="text-2xl md:text-3xl font-['IvyMode'] text-white mt-2">
                  Echelon
                </h1>
              </div>

              {/* Page title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-['IvyMode'] text-white mb-4 md:mb-6">Sign In</h1>
              
              {/* Navigation text */}
              <p className="text-[#999999] mb-4 md:mb-5 text-sm md:text-base">
                Don't have an account? {" "}
                <span className="ml-2 text-white underline cursor-pointer" onClick={() => navigate("/signup")}>
                  Sign Up
                </span>
              </p>

              {/* Signin Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Email field */}
                <div>
                  <label className="block text-white font-['Jost'] text-xs md:text-sm mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border ${errors.email ? 'border-red-500' : 'border-[#F0F0F0]'} text-black placeholder-[#757575] focus:outline-none focus:ring-none font-['Jost'] rounded-full text-sm md:text-base`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-white font-['Jost'] text-xs md:text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border ${errors.password ? 'border-red-500' : 'border-[#F0F0F0]'} rounded-full text-black placeholder-[#757575] focus:outline-none focus:ring-none font-['Jost'] pr-12 md:pr-16 text-sm md:text-base`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#999999] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} className="md:w-6 md:h-6" /> : <Eye size={20} className="md:w-6 md:h-6" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || subscriptionLoading}
                  className="w-full bg-[#A17E3C] hover:bg-[#8B6B32] disabled:opacity-50 disabled:cursor-not-allowed text-white mt-4 md:mt-6 py-2.5 md:py-3 rounded-full font-['Jost'] transition-colors duration-200 shadow-lg text-sm md:text-base cursor-pointer flex items-center justify-center gap-2"
                >
                  {(loading || subscriptionLoading) && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {loading ? "Signing In..." : subscriptionLoading ? "Checking Access..." : "Sign In"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        <p className="text-gray-700 font-['Jost']">{modal.message}</p>
      </Modal>
    </div>
  );
}

export default SigninPage;