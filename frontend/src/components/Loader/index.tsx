import React from "react";

interface LoaderProps {
  fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullPage = true }) => {
  return (
    <div className={`flex items-center justify-center ${fullPage ? "min-h-screen bg-slate-950" : "py-12"}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-800"></div>
          {/* Glowing spinning ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-t-blue-500 border-r-blue-500/30 border-b-blue-500/10 border-l-transparent animate-spin glow-primary"></div>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default Loader;
