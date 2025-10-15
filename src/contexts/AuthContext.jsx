import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../integrations/supabase/client";
import Modal from "../components/ui/Modal";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) { throw new Error("useAuth must be used within AuthProvider"); }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  const [navigateToPortfolio, setNavigateToPortfolio] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "" });
  const [skipApiCheck, setSkipApiCheck] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  const signUp = async (email, password, fullName) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, },
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const getProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles").select("*").eq("id", userId).single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (data && data.navigate_to_portfolio === undefined) data.navigate_to_portfolio = false;

      return data;
    } catch (error) {
      console.error("Error in getProfile:", error);
      return null;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password,
      });
      if (error) throw error;
      // Don't manually update state - let the auth listener handle it
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      setSession(null);
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setNavigateToPortfolio(false);
      setIsTrialActive(false);
      setTrialDaysRemaining(0);

      const { error } = await supabase.auth.signOut();
      if (error) console.error("Sign out error:", error);
    } catch (error) { console.error("Error in signOut:", error); }
  };

  const startTrial = async () => {
    if (!user) {
      setModal({
        isOpen: true,
        title: "Authentication Required",
        message: "Please log in to start your trial.",
      });
      return;
    }

    if (!session?.access_token) {
      setModal({
        isOpen: true,
        title: "Authentication Required",
        message: "Please log in to start your trial.",
      });
      return;
    }

    try {
      try {
        const { data, error } = await supabase.functions.invoke(
          "create-trial-checkout",
          { headers: { Authorization: `Bearer ${session.access_token}`, }, }
        );

        if (error) {
          console.error("Trial checkout error:", error);
          throw error;
        }

        if (!data?.url) {
          console.error("No checkout URL in response:", data);
          throw new Error("No checkout URL received");
        }
 
        window.open(data.url, "_blank");
        return;
      } catch (e) {
        console.error("Trial checkout function not available, falling back to regular checkout", e);

        const { data, error } = await supabase.functions.invoke(
          "create-checkout",
          { headers: { Authorization: `Bearer ${session.access_token}`, }, }
        );

        if (error) {
          console.error("Checkout error:", error);
          throw error;
        }

        if (!data?.url) {
          console.error("No checkout URL in response:", data);
          throw new Error("No checkout URL received");
        }

        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error in startTrial:", error);
      if (
        error.message?.includes("500") ||
        error.message?.includes("Internal Server Error")
      ) {
        setModal({
          isOpen: true,
          title: "Service Temporarily Unavailable",
          message: "The trial service is currently unavailable. Please try again later or contact support.",
        });
      } else {
        setModal({
          isOpen: true,
          title: "Service Unavailable",
          message: "Stripe integration not configured. Please contact support.",
        });
      }
    }
  };

  const createCheckout = async () => {
    if (!session?.access_token) {
      setModal({
        isOpen: true,
        title: "Authentication Required",
        message: "Please log in to subscribe.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        { headers: { Authorization: `Bearer ${session.access_token}`, }, }
      );

      if (error) {
        console.error("Checkout creation error:", error);
        throw error;
      }

      if (!data?.url) {
        console.error("No checkout URL in response:", data);
        throw new Error("No checkout URL received");
      }

      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error in createCheckout:", error);
      if (
        error.message?.includes("500") ||
        error.message?.includes("Internal Server Error")
      ) {
        setModal({
          isOpen: true,
          title: "Service Temporarily Unavailable",
          message: "The checkout service is currently unavailable. Please try again later or contact support.",
        });
      } else {
        setModal({
          isOpen: true,
          title: "Service Unavailable",
          message: "Stripe integration not configured. Please contact support.",
        });
      }
    }
  };

  const manageSubscription = async () => {
    if (!session?.access_token) {
      setModal({
        isOpen: true,
        title: "Authentication Required",
        message: "Please log in to manage your subscription.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "customer-portal",
        { headers: { Authorization: `Bearer ${session.access_token}`, }, }
      );

      if (error) throw error;

      if (data?.url) { window.open(data.url, "_blank"); } 
      else { throw new Error("No portal URL received"); }
    } catch (error) {
      console.error("Error managing subscription:", error);
      if (error.message?.includes("500") || error.message?.includes("Internal Server Error") ) {
        setModal({
          isOpen: true,
          title: "Service Temporarily Unavailable",
          message: "The customer portal service is currently unavailable. Please try again later or contact support.",
        });
      } else {
        setModal({
          isOpen: true,
          title: "Service Unavailable",
          message: "Stripe customer portal not configured. Please contact support.",
        });
      }
    }
  };

  const checkSubscriptionWithSession = async (session, profile) => {
    if (!session?.access_token) {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setIsTrialActive(false);
      setTrialDaysRemaining(0);
      return;
    }

    // If no profile, don't proceed with subscription check
    if (!profile) return;

    // Prevent multiple simultaneous calls
    if (isCheckingSubscription) return;

    try {
      setIsCheckingSubscription(true);
      setSubscriptionLoading(true);

      let hasActiveTrial = false;
      let hasActiveSubscription = false;

      // Check if user has an active trial
      if (profile?.trial_started_at && !profile?.trial_ended_at) {
        const trialStart = new Date(profile.trial_started_at);
        const trialEnd = new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
        const now = new Date();

        if (now < trialEnd) {
          // Trial is still active
          hasActiveTrial = true;
          setIsTrialActive(true);
          setTrialDaysRemaining(Math.ceil( (trialEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
          setSubscribed(true); // Give full access during trial
          setSubscriptionTier("trial");
          setSubscriptionEnd(trialEnd.toISOString());
        } else {
          await supabase
            .from("profiles")
            .update({
              trial_ended_at: now.toISOString(),
              navigate_to_portfolio: false,
            })
            .eq("id", profile.id);
        }
      }

      // Always check regular subscription (user might have both trial and subscription)
      const { data, error } = await supabase.functions.invoke(
        "check-subscription",
        {headers: { Authorization: `Bearer ${session.access_token}`,},}
      );

      if (error) {
        console.error("Subscription check error:", error);
        throw error;
      }

      hasActiveSubscription = data.subscribed || false;

      // If no active trial, use subscription data
      if (!hasActiveTrial) {
        setSubscribed(hasActiveSubscription);
        setSubscriptionTier(data.subscription_tier || null);
        setSubscriptionEnd(data.subscription_end || null);
        setIsTrialActive(false);
        setTrialDaysRemaining(0);
      }

      // Update navigate_to_portfolio based on subscription/trial status
      const shouldNavigateToPortfolio = hasActiveTrial || hasActiveSubscription;

      // Always update local state first
      setNavigateToPortfolio(shouldNavigateToPortfolio);

      if ( profile && profile.navigate_to_portfolio !== shouldNavigateToPortfolio ) {
        await supabase
          .from("profiles")
          .update({ navigate_to_portfolio: shouldNavigateToPortfolio })
          .eq("id", profile.id);

        // Update local profile state
        setProfile((prev) =>
          prev
            ? { ...prev, navigate_to_portfolio: shouldNavigateToPortfolio }
            : null
        );
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      // Set defaults on error
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setIsTrialActive(false);
      setTrialDaysRemaining(0);
    } finally { 
      setSubscriptionLoading(false);
      setIsCheckingSubscription(false);
    }
  };

  const checkSubscription = async () => {
    await checkSubscriptionWithSession(session, profile);
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles").update(updates).eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;
    let isInitialized = false;
    let initTimeout = null;

    const completeInitialization = () => {
      if (!isInitialized && mounted) {
        isInitialized = true;
        if (initTimeout) {
          clearTimeout(initTimeout);
          initTimeout = null;
        }
        setLoading(false);
      }
    };

    const initializeAuth = async () => {
      try {
        // Add a timeout to prevent infinite loading
        initTimeout = setTimeout(() => {
          if (mounted && !isInitialized) {
            console.warn("Auth initialization timeout, forcing completion");
            completeInitialization();
          }
        }, 15000); // 15 second timeout

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) {
          if (initTimeout) {
            clearTimeout(initTimeout);
            initTimeout = null;
          }
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const profile = await getProfile(session.user.id);
            if (!mounted) {
              if (initTimeout) {
                clearTimeout(initTimeout);
                initTimeout = null;
              }
              return;
            }

            if (profile) {
              setProfile(profile);

              // Check subscription status immediately
              if (mounted) await checkSubscriptionWithSession(session, profile);
            } else {
              setProfile({
                id: session.user.id,
                email: session.user.email,
                navigate_to_portfolio: false,
                is_admin: false,
                trial_started_at: null,
                trial_ended_at: null,
              });
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
            // Set a minimal profile to prevent blocking
            setProfile({
              id: session.user.id,
              email: session.user.email,
              navigate_to_portfolio: false,
              is_admin: false,
              trial_started_at: null,
              trial_ended_at: null,
            });
          }
        } else {
          setProfile(null);
          setSubscribed(false);
          setSubscriptionTier(null);
          setSubscriptionEnd(null);
        }

        // Complete initialization
        completeInitialization();
      } catch (error) {
        console.error("AuthContext: Error initializing auth:", error);
        completeInitialization();
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
        initTimeout = null;
      }
    };
  }, []);

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Don't process initial session event as it's handled by initializeAuth
      if (event === "INITIAL_SESSION") return;

      // For SIGNED_IN events during initialization, let initializeAuth handle it
      if (event === "SIGNED_IN" && loading) return;

      // Prevent double processing
      if (isProcessingAuth) return;

      try {
        setIsProcessingAuth(true);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profile = await getProfile(session.user.id);
          setProfile(profile);
          // Check subscription status when user logs in
          await checkSubscriptionWithSession(session, profile);
        } else {
          setProfile(null);
          setSubscribed(false);
          setSubscriptionTier(null);
          setSubscriptionEnd(null);
        }
      } finally {
        setIsProcessingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loading, isProcessingAuth]);

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "" });
  };

  const checkSubscriptionFromDatabase = async () => {
    if (!user) return { hasAccess: false, redirectTo: "/membership" };

    try {
      // Check profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("navigate_to_portfolio, trial_started_at, trial_ended_at")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Check subscribers table
      const { data: subscriberData } = await supabase
        .from("subscribers")
        .select("subscribed, subscription_tier, subscription_end")
        .eq("user_id", user.id)
        .single();

      const hasActiveSubscription = subscriberData?.subscribed || false;
      const canAccess = profileData?.navigate_to_portfolio || false;
      const tier = subscriberData?.subscription_tier || null;
      const endDate = subscriberData?.subscription_end || null;

      // Update local state with database values
      setSubscribed(hasActiveSubscription);
      setSubscriptionTier(tier);
      setSubscriptionEnd(endDate);
      setNavigateToPortfolio(canAccess);

      return {
        hasAccess: canAccess,
        redirectTo: canAccess ? "/portal" : "/membership",
      };
    } catch (error) {
      console.error("Error checking database:", error);
      return { hasAccess: false, redirectTo: "/membership" };
    }
  };

  const fixSubscriberRecord = async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

      // Force update subscribers table
      await supabase
        .from("subscribers")
        .update({
          subscribed: true,
          subscription_tier: "premium",
          subscription_end: trialEnd,
          updated_at: now,
        })
        .eq("user_id", user.id);

      // Update local state
      setSubscribed(true);
      setSubscriptionTier("premium");
      setSubscriptionEnd(trialEnd);
      setSkipApiCheck(true);

      setModal({
        isOpen: true,
        title: "Subscriber Fixed!",
        message: "Subscriber record has been fixed. You now have access!",
      });
    } catch (error) {
      console.error("Error fixing subscriber:", error);
      setModal({
        isOpen: true,
        title: "Fix Failed",
        message: "Failed to fix subscriber record. Error: " + error.message,
      });
    }
  };

  const activateTrialManually = async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const trialEnd = new Date( Date.now() + 3 * 24 * 60 * 60 * 1000 ).toISOString();

      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          trial_started_at: now,
          trial_ended_at: null,
          navigate_to_portfolio: true,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update subscribers table
      const { error: subscriberError } = await supabase
        .from("subscribers")
        .upsert(
          {
            email: user.email,
            user_id: user.id,
            subscribed: true,
            subscription_tier: "premium",
            subscription_end: trialEnd,
            updated_at: now,
          },
          { onConflict: "email" }
        );

      if (subscriberError) throw subscriberError;

      // Update local state
      setSubscribed(true);
      setSubscriptionTier("premium");
      setSubscriptionEnd(trialEnd);
      setNavigateToPortfolio(true);
      setIsTrialActive(true);
      setTrialDaysRemaining(3);
      setSkipApiCheck(true);

      setModal({
        isOpen: true,
        title: "Trial Activated!",
        message: "Your 3-day free trial has been activated successfully. You can now access the portal!",
      });
    } catch (error) {
      console.error("Error activating trial:", error);
      setModal({
        isOpen: true,
        title: "Activation Failed",
        message: "Failed to activate trial. Please try again.",
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    subscribed,
    subscriptionLoading,
    isTrialActive,
    trialDaysRemaining,
    subscriptionTier,
    subscriptionEnd,
    navigateToPortfolio,
    signUp,
    signIn,
    signOut,
    startTrial,
    createCheckout,
    manageSubscription,
    checkSubscription,
    checkSubscriptionFromDatabase,
    updateProfile,
    activateTrialManually,
    fixSubscriberRecord,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type="error"
      >
        <p className="text-gray-700 font-['Jost']">{modal.message}</p>
      </Modal>
    </AuthContext.Provider>
  );
};