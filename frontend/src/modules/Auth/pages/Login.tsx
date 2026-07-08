import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/helpers";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiCheckSquare, FiEye, FiEyeOff } from "react-icons/fi";
import { RootState } from "@/redux/store";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean().optional(),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    dispatch(loginStart());
    try {
      const res = await authService.login(data);
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );
      toast.success("Welcome back! Login successful.");
      navigate("/dashboard");
    } catch (error: any) {
      const msg = getErrorMessage(error);
      dispatch(loginFailure(msg));
      toast.error(msg);
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
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-slate-300">Email Address</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FiMail />
              </span>
              <Input
                type="email"
                id="login-email"
                placeholder="Enter your email"
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
            <Label htmlFor="login-password" className="text-slate-300">Password</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FiLock />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                id="login-password"
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

          <div className="flex items-center justify-between text-xs select-none">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                id="login-remember-me"
                className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950 focus:ring-offset-2"
                {...register("rememberMe")}
              />
              <span>Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            id="login-submit-btn"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 shadow-lg shadow-blue-500/20"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            id="register-link"
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
