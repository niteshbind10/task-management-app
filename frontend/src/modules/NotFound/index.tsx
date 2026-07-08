import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="text-center max-w-md p-8 glass-panel border border-slate-800 rounded-2xl glow-primary animate-fadeIn">
        <h1 className="text-8xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent leading-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-200 mt-4 mb-2 tracking-wide">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved to another path.
        </p>
        <Button onClick={() => navigate("/dashboard")} variant="primary">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
