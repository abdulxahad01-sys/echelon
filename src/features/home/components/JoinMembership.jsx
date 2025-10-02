import { Check } from "lucide-react";
import logo from "../../../assets/echelon_logo.png";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function JoinMembership() {
  const {
    user,
    subscribed,
    isTrialActive,
    startTrial,
    createCheckout,
    manageSubscription,
  } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleStartTrial = async () => {
    try {
      await startTrial();
    } catch (error) {
      console.error("Error starting trial:", error);
    }
  };

  const handleSubscribe = async () => {
    try {
      await createCheckout();
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await manageSubscription();
    } catch (error) {
      console.error("Error managing subscription:", error);
    }
  };


  const getMembershipContent = () => {
    if (!user) {
      return {
        title: "Digital Membership",
        description: "Full access to the Echelon community",
        buttonText: "Get Started",
        bottomText: "Try Echelon free for 3 days, then $20/month. Cancel anytime.",
        linkText: "Sign up here",
      };
    }

    if (isTrialActive) {
      return {
        title: "Trial Active",
        description: "You're currently on a free trial",
        buttonText: "Upgrade Now",
        bottomText: "Trial expires soon?",
        linkText: "Subscribe to continue",
      };
    }

    if (subscribed) {
      return {
        title: "Active Member",
        description: "You have full access to Echelon",
        buttonText: "Manage Subscription",
        bottomText: "Need help?",
        linkText: "Contact support",
      };
    }

    return {
      title: "Join Echelon",
      description: "Upgrade to access the full community",
      buttonText: "Subscribe Now",
      bottomText: "Questions about membership?",
      linkText: "Learn more",
    };
  };

  async function handleSubcriptionInTrial(content) {
    if (content.linkText === 'Subscribe to continue') {
        await createCheckout();
    } else if (content.linkText === 'Sign up here') {
        navigate('/signup');
    }
  }

  const content = getMembershipContent();
  return (
    <div className="w-[95vw] md:w-[97vw] min-h-[70vh] md:min-h-[80vh] lg:min-h-[95vh] mx-auto rounded-xl md:rounded-2xl bg-[#1F1D1E] px-4 md:px-0 flex flex-col justify-center -mt-16 md:-mt-20 py-16 md:py-28">
      <div className="w-fit mx-auto flex items-center justify-center border border-[#A87B4D] rounded-full px-4 md:px-6">
        <img
          src={logo}
          className="size-10 md:size-12 -ml-2.5 md:-ml-3.5 object-contain"
        />
        <h1 className="font-['jost'] text-base md:text-lg text-white">
          Membership
        </h1>
      </div>
      <h1 className="font-['IvyMode'] text-white text-center text-3xl md:text-4xl lg:text-[58px] uppercase tracking-wide mt-2 md:mt-1.5 px-4">
        Join Echelon
      </h1>
      <p className="font-['jost'] text-[#9A9A9A] text-center tracking-wide mt-2 md:mt-1.5 text-sm md:text-base px-4">
        Step into an exclusive experience built on elegance, privacy, and
        lasting memories.
      </p>

      {user?.email !== "anthonytaye@gmail.com" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto mt-6 md:mt-8 px-4 md:px-0">
          {/* Membership Card */}
          <div
            className={`w-full max-w-[400px] mx-auto px-6 md:px-8 py-6 md:py-8 rounded-2xl border shadow-xl ${
              subscribed
                ? "border-[#A17E3C] bg-black/20"
                : "border-[#A17E3C] bg-black/20"
            } flex flex-col justify-center items-center`}
          >
            <h1 className="font-['IvyMode'] text-3xl text-center leading-9 my-2 text-[#A17E3C]">
              {subscribed ? content.title : content.title}
            </h1>

            <p className="font-['Jost'] leading-6 text-center text-[#ECECECCC] mb-6 max-w-[280px]">
              {content.description}
            </p>

            <div className="border-b-2 border-[#D9D9D91A] w-[80%] mb-8" />

            <div className="text-center">
              <h1 className="font-['Jost'] text-4xl font-semibold text-white flex items-baseline justify-center gap-1">
                <span className="text-lg">$</span>
                <span>20</span>
                <span className="text-[#ECECECCC] text-lg">/month</span>
              </h1>
            </div>

            <p className="text-[#ECECECCC] text-center text-sm font-['Jost'] mb-8">
              Billed monthly, cancel anytime
            </p>

            {/* Action Buttons */}
            <div className="space-y-4 w-full max-w-[280px]">
              {!user ? (
                <div className="space-y-4">
                  <button
                    onClick={handleSignIn}
                    className="w-full py-4 text-lg bg-[#A17E3C] text-white rounded-full font-['Jost'] font-medium hover:bg-[#8B6B32] transition-colors duration-200 cursor-pointer"
                  >
                    Sign In to Subscribe
                  </button>
                  {/* <p className="text-white/60 text-center text-sm font-['Jost']">
                    Don't have an account?{" "}
                    <span
                      onClick={() => navigate("/signup")}
                      className="text-[#A17E3C] hover:underline cursor-pointer"
                    >
                      Sign up here
                    </span>
                  </p> */}
                </div>
              ) : subscribed ? (
                <div className="space-y-4">
                  <button
                    onClick={handleManageSubscription}
                    className="w-full py-4 text-base bg-[#A17E3C] text-white rounded-full font-['Jost'] hover:bg-[#8B6B32] transition-colors duration-200 cursor-pointer"
                  >
                    Manage Subscription
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleStartTrial}
                    className="w-full py-4 text-base bg-[#A17E3C] text-white rounded-full font-['Jost'] hover:bg-[#8B6B32] transition-colors duration-200 cursor-pointer"
                  >
                    Start 3-Day Free Trial
                  </button>
                  <button
                    onClick={handleSubscribe}
                    className="w-full py-3 text-base border border-[#A17E3C] text-[#A17E3C] rounded-full font-['Jost'] hover:bg-[#A17E3C] hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Subscribe for $20/month
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs md:text-sm text-center text-[#ECECECCC] font-['Jost'] mb-2.5 max-w-[320px] px-2 mt-6">
              {content.bottomText}{" "}
              <span onClick={() => handleSubcriptionInTrial(content)} className="text-[#A17E3C] underline hover:text-[#C4973F] cursor-pointer transition-colors duration-200">
                {content.linkText}
              </span>
            </p>

            <p className="text-xs md:text-sm text-center text-[#ECECECCC] font-['Jost'] max-w-[320px] leading-4 md:leading-5 mb-2 px-2">
              By joining, you agree to our{" "}
              <span className="text-[#A17E3C] underline hover:text-[#C4973F] cursor-pointer transition-colors duration-200">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-[#A17E3C] underline hover:text-[#C4973F] cursor-pointer transition-colors duration-200">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Card 2 */}
          <div className="w-full max-w-[400px] mx-auto px-6 md:px-8 py-6 md:py-8 flex flex-col justify-center items-start">
            <h1 className="font-['IvyMode'] text-2xl md:text-3xl text-center leading-8 md:leading-9 text-[#A17E3C] mb-4 md:mb-6 w-full">
              What’s Included
            </h1>

            <ul className="text-white font-['Jost'] space-y-2 md:space-y-3 text-sm md:text-base w-full">
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>Professional networking opportunities</span>
              </li>
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>Early access to events and announcements</span>
              </li>
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>Private member feed and interactions</span>
              </li>
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>Secure member directory</span>
              </li>
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>Priority booking for club amenities</span>
              </li>
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>Access to member-only content</span>
              </li>
              <li className="flex items-start gap-x-2">
                <Check className="w-5 h-5 text-[#A17E3C] mt-1" />
                <span>24/7 concierge support</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinMembership;
