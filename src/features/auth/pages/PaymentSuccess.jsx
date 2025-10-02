import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { CheckCircle, ArrowRight } from "lucide-react";
import logo from "../../../assets/echelon_logo.png";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription, subscribed } = useAuth();
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }
  }, [success, checkSubscription]);

  if (success !== 'true') {
    navigate('/membership');
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#1F1D1E] border border-[#A17E3C] rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A17E3C]/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#A17E3C]" />
          </div>
          <h1 className="text-2xl font-['IvyMode'] text-[#A17E3C] mb-2">
            Welcome to Echelon!
          </h1>
          <p className="text-[#ECECECCC] text-lg font-['Jost'] mb-6">
            Your subscription has been activated
          </p>
          
          <p className="text-white/80 font-['Jost'] mb-8">
            Thank you for joining our exclusive community. You now have full access to all premium features and the member portal.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/portal')}
              className="w-full bg-[#A17E3C] hover:bg-[#8B6B32] text-white font-['Jost'] font-semibold py-4 text-lg rounded-full transition-colors flex items-center justify-center gap-2"
            >
              Enter Member Portal
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="w-full border border-[#A17E3C] text-[#A17E3C] hover:bg-[#A17E3C] hover:text-white font-['Jost'] py-3 rounded-full transition-colors"
            >
              Return to Homepage
            </button>
          </div>

          <div className="pt-6 mt-6 border-t border-[#A17E3C]/20">
            <p className="text-white/60 text-sm font-['Jost']">
              {subscribed 
                ? "✓ Subscription confirmed and active" 
                : "Verifying your subscription... This may take a moment."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;