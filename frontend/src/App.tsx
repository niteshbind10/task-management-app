import Routes from "@/routes";
import { ToastContainer } from "react-toastify";
import useSocket from "@/hooks/useSocket";
import useTheme from "@/hooks/useTheme";

const App = () => {
  // Initialize Socket.io connection and Dark/Light Mode active styling hooks
  useSocket();
  useTheme();

  return (
    <>
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default App;
