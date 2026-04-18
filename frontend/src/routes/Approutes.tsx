import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/Signup";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoutes";
import Dashboard from "@/pages/Dashboard";
import OAuthCallback from "@/pages/OAuthCallbackPage";

export default function Approutes() {
  return (
    <Routes>
      <Route element={<AuthRoute mode="root" />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<AuthRoute mode="public" />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/oauth-success" element={<OAuthCallback />} />
      </Route>
      <Route element={<AuthRoute mode="protected" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
