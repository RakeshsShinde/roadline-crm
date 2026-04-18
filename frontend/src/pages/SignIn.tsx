import api from "@/Api/axios";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm, type SignFormData } from "@/components/auth/auth-form";
import { GitHubButton, GoogleButton } from "@/components/auth/Social-buttons";
import { setAuth } from "@/store/slices/AuthSlice";
import type { AppDispatch } from "@/store/store";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as { from?: string })?.from ?? "/dashboard";

  const handleSignIn = async (data: SignFormData) => {
    const { email, password } = data;

    try {
      setIsLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      dispatch(
        setAuth({
          access_token: accessToken,
          user,
        }),
      );

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Logged in successfully", {
        position: "top-right",
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Login failed", {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account to continue"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        {/* Social login */}
        <div className="space-y-3">
          <GoogleButton />
          <GitHubButton />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/password form */}
        <AuthForm type="signin" onSubmit={handleSignIn} isLoading={isLoading} />
      </div>
    </AuthCard>
  );
}
