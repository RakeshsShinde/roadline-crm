import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (data: SignFormData) => void;
  isLoading?: boolean;
}

export interface SignFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
}

export function AuthForm({ type, onSubmit, isLoading = false }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {type === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="email">Name</Label>
          <Input
            id="name"
            type="name"
            placeholder="you@example.com"
            disabled={isLoading}
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "name should be atleast 3 characters long ",
              },
              maxLength: {
                value: 20,
                message: "name should be max 20 characters long ",
              },
            })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name?.message}</p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email?.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {type === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              min: 6,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className={errors.confirmPassword ? "border-destructive" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Loading..."
          : type === "signin"
            ? "Sign In"
            : "Create Account"}
      </Button>
    </form>
  );
}
