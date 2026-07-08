import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/helpers";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiCheckSquare, FiEye, FiEyeOff } from "react-icons/fi";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-4 select-none relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[80px] animate-pulseGlow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] animate-pulseGlow" style={{ animationDelay: "1.5s" }}></div>

      <div className="w-full max-w-md p-8 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl animate-fadeIn z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/20 border border-blue-500/30">
            <FiCheckSquare className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
            MAYFAIR TASKS
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
            Create an Account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="register-form">
          <div className="space-y-2">
            <Label htmlFor="register-name" className="text-slate-300">Full Name</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FiUser />
              </span>
              <Input
                type="text"
                id="register-name"
                placeholder="John Doe"
                className="pl-10 bg-slate-950/40 border-slate-800 focus-visible:ring-blue-500 text-slate-100"
                disabled={loading}
                {...register("fullName")}
              />
            </div>
            {errors.fullName?.message && (
              <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-slate-300">Email Address</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FiMail />
              </span>
              <Input
                type="email"
                id="register-email"
                placeholder="john@example.com"
                className="pl-10 bg-slate-950/40 border-slate-800 focus-visible:ring-blue-500 text-slate-100"
                disabled={loading}
                {...register("email")}
              />
            </div>
            {errors.email?.message && (
              <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-slate-300">Password</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FiLock />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                id="register-password"
                placeholder="••••••••"
                className="pl-10 pr-10 bg-slate-950/40 border-slate-800 focus-visible:ring-blue-500 text-slate-100"
                disabled={loading}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            id="register-submit-btn"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 shadow-lg shadow-blue-500/20"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            id="login-link"
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
