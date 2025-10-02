import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../../../integrations/supabase/client";
import logo from "../../../assets/echelon_logo.png";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const TrialSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  
  const trialStarted = searchParams.get('trial_started');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processTrialSuccess = async () => {
      if (trialStarted === 'true' || sessionId) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setError('User not authenticated');
            setIsProcessing(false);
            return;
          }

          const now = new Date().toISOString();
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              trial_started_at: now,
              trial_ended_at: null,
              navigate_to_portfolio: true,
              updated_at: now
            })
            .eq('id', user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
            setError('Failed to update profile');
          }

          const { error: subscriberError } = await supabase
            .from('subscribers')
            .upsert({
              email: user.email,
              user_id: user.id,
              subscribed: true,
              subscription_tier: 'premium',
              subscription_end: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString(),
              updated_at: now
            }, { onConflict: 'email' });

          if (subscriberError) {
            console.error('Error updating subscribers:', subscriberError);
          }

          setTimeout(async () => {
            await checkSubscription();
            setIsProcessing(false);
            
            setTimeout(() => {
              navigate('/portal', { replace: true });
            }, 2000);
          }, 1000);

        } catch (err) {
          console.error('Error processing trial success:', err);
          setError('Failed to process trial');
          setIsProcessing(false);
        }
      } else {
        navigate('/membership');
      }
    };

    processTrialSuccess();
  }, [trialStarted, sessionId, checkSubscription, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#1F1D1E] border border-red-500/30 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <img src={logo} alt="Echelon" className="w-16 h-auto mx-auto mb-4 object-contain" />
            <h2 className="text-xl font-['IvyMode'] text-red-500 mb-2">
              Error Processing Trial
            </h2>
            <p className="text-[#ECECECCC] mb-6 font-['Jost']">
              {error}
            </p>
            <button 
              onClick={() => navigate('/membership')}
              className="w-full py-3 bg-[#A17E3C] text-white rounded-full font-['Jost'] hover:bg-[#8B6B32] transition-colors"
            >
              Return to Membership
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <LoadingSpinner 
        fullScreen={true}
        text="Setting up your 3-day free trial..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#1F1D1E] border border-[#A17E3C] rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A17E3C]/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#A17E3C]" />
          </div>
          <h1 className="text-2xl font-['IvyMode'] text-[#A17E3C] mb-2">
            Trial Started Successfully!
          </h1>
          <p className="text-[#ECECECCC] text-lg font-['Jost'] mb-6">
            Your 3-day free trial has begun
          </p>
          
          <p className="text-white/80 font-['Jost'] mb-8">
            Enjoy full access to all premium features during your trial period. 
            You won't be charged until the trial ends.
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
              ✓ Trial activated and account updated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialSuccess;