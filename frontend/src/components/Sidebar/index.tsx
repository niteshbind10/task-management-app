import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";
import { toast } from "react-toastify";
import { FiGrid, FiList, FiLogOut, FiActivity } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch {
      dispatch(logout());
      navigate("/login");
    }
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid size={20} /> },
    { to: "/tasks", label: "Tasks Manager", icon: <FiList size={20} /> },
    { to: "/kanban", label: "Kanban Board", icon: <FiActivity size={20} /> },
  ];

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${isActive
      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/20"
      : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
          id="sidebar-backdrop"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-950/40 border-r border-slate-200 dark:border-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-slate-100 flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-900/60 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/20">
            <FiActivity className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-wide">
              MAYFAIR
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mt-0.5">
              Task Manager
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => linkClasses(isActive)}
              onClick={() => setIsOpen(false)}
              id={`sidebar-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-900/60 bg-slate-100/50 dark:bg-slate-950/10">
          <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white border border-blue-400/20 shadow-md">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                {user?.fullName}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 border border-transparent hover:border-rose-500/10"
            id="sidebar-logout-btn"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
