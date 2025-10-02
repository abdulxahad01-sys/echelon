import { Suspense, lazy } from "react";

// Lazy load components
const Footer = lazy(() => import("@/components/Footer"));
const Navbar = lazy(() => import("../../../components/Navbar"));
const ContactUs = lazy(() => import("../components/ContactUs"));
const FAQ = lazy(() => import("../components/FAQ"));
const JoinMembership = lazy(() => import("../components/JoinMembership"));

function MembershipPage() {
  return (
    <div>
      <Navbar />

      <div className="space-y-16 md:space-y-20 lg:space-y-24">
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

      <Suspense fallback={<div></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default MembershipPage;
