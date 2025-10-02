import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ProtectedRoute from "../../components/ProtectedRoute";

// Lazy imports for code splitting
const LandingPage = lazy(() => import("../../features/home").then(module => ({ default: module.LandingPage })));
const MembershipPage = lazy(() => import("../../features/home").then(module => ({ default: module.MembershipPage })));
const SigninPage = lazy(() => import("@/features/auth").then(module => ({ default: module.SigninPage })));
const SignupPage = lazy(() => import("@/features/auth").then(module => ({ default: module.SignupPage })));
const TrialSuccess = lazy(() => import("@/features/auth").then(module => ({ default: module.TrialSuccess })));
const PaymentSuccess = lazy(() => import("@/features/auth").then(module => ({ default: module.PaymentSuccess })));
const Layout = lazy(() => import("@/features/portal").then(module => ({ default: module.Layout })));
const HomePage = lazy(() => import("@/features/portal").then(module => ({ default: module.HomePage })));
const CreateNewPost = lazy(() => import("@/features/portal").then(module => ({ default: module.CreateNewPost })));
const CreateStory = lazy(() => import("@/features/portal").then(module => ({ default: module.CreateStory })));
const Chats = lazy(() => import("@/features/portal").then(module => ({ default: module.Chats })));
const Profile = lazy(() => import("@/features/portal").then(module => ({ default: module.Profile })));
const AdminLayout = lazy(() => import("@/features/admin").then(module => ({ default: module.AdminLayout })));
const UsersPage = lazy(() => import("@/features/admin").then(module => ({ default: module.UsersPage })));
const ReportsPage = lazy(() => import("@/features/admin").then(module => ({ default: module.ReportsPage })));
const AuditLogsPage = lazy(() => import("@/features/admin").then(module => ({ default: module.AuditLogsPage })));
const NotFound = lazy(() => import("../../components/NotFound"));


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<div></div>}>
          <LandingPage />
        </Suspense>
      } />
      <Route path="/membership" element={
        <Suspense fallback={<div></div>}>
          <MembershipPage />
        </Suspense>
      } />
        <Route path="/signin" element={
          <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
            <SigninPage />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
            <SignupPage />
          </Suspense>
        } />
        <Route path="/trial-success" element={
          <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
            <TrialSuccess />
          </Suspense>
        } />
        <Route path="/payment-success" element={
          <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
            <PaymentSuccess />
          </Suspense>
        } />
        
        <Route path="/portal" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <Layout />
            </Suspense>
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <HomePage />
            </Suspense>
          } />
          <Route path="create-post" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <CreateNewPost />
            </Suspense>
          } />
          <Route path="create-story" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <CreateStory />
            </Suspense>
          } />
          <Route path="chats" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <Chats />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <Profile />
            </Suspense>
          } />
          <Route path="profile/:id" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <Profile />
            </Suspense>
          } />
        </Route>

        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
            <AdminLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <UsersPage />
            </Suspense>
          } />
          <Route path="report" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <ReportsPage />
            </Suspense>
          } />
          <Route path="audit-log" element={
            <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
              <AuditLogsPage />
            </Suspense>
          } />
        </Route>

        <Route path="*" element={
          <Suspense fallback={<LoadingSpinner fullScreen={true} text="Loading..." />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
  );
}