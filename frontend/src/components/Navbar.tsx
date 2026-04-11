import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotifications(user?.id ?? null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOpen() {
    if (!open && unreadCount > 0) markAllRead();
    setOpen((v) => !v);
  }

  return (
    <header className="border-b border-gray-200 bg-white h-[65px] flex items-center">
      <div className="flex w-full items-center justify-between px-6">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Second-hand Marketplace
          </Link>
          <p className="text-sm text-gray-600">CSCI3100 Group 2 Project</p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Bell icon with unread badge */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleOpen}
                  className="relative rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {open && (
                  <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                      <span className="text-sm font-semibold text-gray-800">
                        Notifications
                      </span>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <ul className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <li className="py-6 text-center text-sm text-gray-400">
                          No notifications yet
                        </li>
                      ) : (
                        notifications.map((n) => (
                          <li
                            key={n.id}
                            className="border-b border-gray-50 px-4 py-3 last:border-0"
                          >
                            <p className="text-sm text-gray-800">{n.message}</p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {n.sent_at}
                            </p>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/", { replace: true });
                }}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
