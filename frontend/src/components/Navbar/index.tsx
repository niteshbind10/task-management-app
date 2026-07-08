import React from "react";
import { FiMenu, FiCheckSquare } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const handleToggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-8 py-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSidebar}
            className="p-2 -ml-2 rounded-xl hover:bg-muted lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            id="sidebar-toggle-btn"
          >
            <FiMenu size={22} />
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-wide truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2.5 bg-secondary/60 border border-border rounded-xl px-4 py-2 text-xs text-foreground shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
              <FiCheckSquare className="text-muted-foreground" />
              TASK SYNC ACTIVE
            </span>
          </div>

          {/* Theme Toggle Switcher */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
