import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import socketService from "@/services/socket.service";

export const useSocket = () => {
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.id && token) {
      socketService.connect(user.id, token);
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated, user?.id, token]);
};

export default useSocket;
