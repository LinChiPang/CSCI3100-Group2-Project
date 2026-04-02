import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Second-hand Marketplace
          </Link>
          <p className="text-sm text-gray-600">CSCI3100 Group 2 Project</p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
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

