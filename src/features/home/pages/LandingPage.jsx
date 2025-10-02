import { Suspense, lazy } from "react";

// Lazy load components
const Footer = lazy(() => import("@/components/Footer"));
const Navbar = lazy(() => import("../../../components/Navbar"));
const ContactUs = lazy(() => import("../components/ContactUs"));
const FAQ = lazy(() => import("../components/FAQ"));
const Gallery = lazy(() => import("../components/Gallery"));
const Hero = lazy(() => import("../components/Hero"));
const JoinMembership = lazy(() => import("../components/JoinMembership"));
const MembershipBenefit = lazy(() => import("../components/MembershipBenefit"));
const WelcomeSection = lazy(() => import("../components/WelcomeSection"));

function LandingPage() {
  return (
    <div>
        <Navbar />
      
      <div className="space-y-16 md:space-y-20 lg:space-y-24">
        <Suspense fallback={<div></div>}>
          <Hero />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <WelcomeSection />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <Gallery />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <MembershipBenefit />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <JoinMembership />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <FAQ />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <ContactUs />
        </Suspense>
      </div>
      
        <Footer />
    </div>
  );
}

export default LandingPage;
