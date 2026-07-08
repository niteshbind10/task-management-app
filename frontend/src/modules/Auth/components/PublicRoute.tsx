import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "@/redux/store";
import { loginSuccess } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";
import Loader from "@/components/Loader";

const PublicRoute: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isVerifying, setIsVerifying] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setIsVerifying(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await authService.getMe();
        dispatch(loginSuccess({ user: response.data, token: "" }));
      } catch {
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [isAuthenticated, dispatch]);

  if (isVerifying) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
