import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TrialCountdown = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
    if (!user || !profile?.trial_started_at || profile?.trial_ended_at) return;

    const updateCountdown = () => {
      const trialStart = new Date(profile.trial_started_at);
      const trialEnd = new Date(trialStart.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days
      const now = new Date();
      const difference = trialEnd.getTime() - now.getTime();

      if (difference > 0) {
        setIsTrialActive(true);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`);
        } else if (hours > 0) {
          setTimeLeft(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeLeft(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }

        setIsExpiringSoon(difference < 24 * 60 * 60 * 1000);
      } else {
        setTimeLeft('Trial expired');
        setIsExpiringSoon(true);
        setIsTrialActive(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [user, profile]);

  if (!isTrialActive) return null;

  return (
    <div className={`mb-6 p-4 rounded-xl border ${
      isExpiringSoon 
        ? 'border-orange-500/50 bg-orange-500/10' 
        : 'border-[#A17E3C]/50 bg-[#A17E3C]/10'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            isExpiringSoon ? 'bg-orange-500/20' : 'bg-[#A17E3C]/20'
          }`}>
            {isExpiringSoon ? (
              <AlertTriangle className={`w-5 h-5 ${
                isExpiringSoon ? 'text-orange-400' : 'text-[#A17E3C]'
              }`} />
            ) : (
              <Clock className="w-5 h-5 text-[#A17E3C]" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold font-['IvyMode'] ${
              isExpiringSoon ? 'text-orange-400' : 'text-[#A17E3C]'
            }`}>
              {isExpiringSoon ? 'Trial Expiring Soon!' : 'Free Trial Active'}
            </h3>
            <p className="text-white/80 text-sm font-['Jost']">
              {isExpiringSoon 
                ? `Your trial ends in ${timeLeft}. Add payment method to continue.`
                : `${timeLeft} remaining in your free trial`
              }
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/membership')}
            className={`px-4 py-2 rounded-lg text-sm font-['Jost'] flex items-center gap-2 transition-colors ${
              isExpiringSoon 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-[#A17E3C] hover:bg-[#A17E3C]/80 text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {isExpiringSoon ? 'Add Payment' : 'Subscribe Now'}
          </button>
          
          <button
            onClick={() => navigate('/membership')}
            className="px-4 py-2 rounded-lg text-sm font-['Jost'] border border-[#A17E3C] text-[#A17E3C] hover:bg-[#A17E3C]/10 transition-colors"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialCountdown;