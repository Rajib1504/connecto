import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validate individual fields
  const validateField = (
    name: keyof FormData,
    value: string,
    currentData: FormData,
  ): string => {
    if (name === "name") {
      if (!value.trim()) {
        return "Name is required.";
      }

      if (value.trim().length < 2) {
        return "Name must be at least 2 characters.";
      }
    } else if (name === "email") {
      if (!value.trim()) {
        return "Email is required.";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        return "Please enter a valid email address.";
      }
    } else if (name === "password") {
      if (!value) {
        return "Password is required.";
      }

      if (value.length < 8) {
        return "Password must be at least 8 characters.";
      }

      if (!/[A-Z]/.test(value)) {
        return "Include at least one uppercase letter.";
      }

      if (!/[a-z]/.test(value)) {
        return "Include at least one lowercase letter.";
      }

      if (!/[0-9]/.test(value)) {
        return "Include at least one number.";
      }
    } else if (name === "confirmPassword") {
      if (!value) {
        return "Please confirm your password.";
      }

      if (value !== currentData.password) {
        return "Passwords do not match.";
      }
    }

    return "";
  };

  // Handle input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormData;

    const updatedData = {
      ...formData,
      [fieldName]: value,
    };

    setFormData(updatedData);

    const fieldError = validateField(fieldName, value, updatedData);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
      ...(fieldName === "password" && updatedData.confirmPassword
        ? {
            confirmPassword: validateField(
              "confirmPassword",
              updatedData.confirmPassword,
              updatedData,
            ),
          }
        : {}),
    }));
  };

  // Check whether the entire form is valid
  const isFormValid = Object.keys(formData).every((key) => {
    const field = key as keyof FormData;

    return validateField(field, formData[field], formData) === "";
  });

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field], formData);

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError ?? "Please check the form and try again.");
      return;
    }

    const Signup_data = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    //api call
    try {
      setIsSubmitting(true);

      // Axios signup API will be connected here.
      const result = await api.post("/auth/signup", Signup_data);

      if (result.data.success) {
        toast.success(result.data.message);
        navigate("/signIn", { replace: true });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessageCircle size={22} />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Connectly
            </span>
          </div>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started and connect with your friends.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="pr-11"
                  aria-invalid={!!errors.password}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  At least 8 characters, including uppercase, lowercase and a
                  number.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="pr-11"
                  aria-invalid={!!errors.confirmPassword}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signIn"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our Terms of Service.
        </p>
      </div>
    </main>
  );
};

export default Signup;
