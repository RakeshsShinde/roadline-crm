import api from "@/Api/axios";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm, type SignFormData } from "@/components/auth/auth-form";
import { GitHubButton, GoogleButton } from "@/components/auth/Social-buttons";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (data: SignFormData) => {
    const { email, name, password } = data;
    try {
      setIsLoading(true);
      const data = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/sign-in");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message ?? "Something went wrong", {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      description="Join us to get started"
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <GoogleButton />
          <GitHubButton />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with email
            </span>
          </div>
        </div>

        <AuthForm type="signup" onSubmit={handleSignUp} isLoading={isLoading} />

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
