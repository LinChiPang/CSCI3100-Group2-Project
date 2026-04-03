import { NavLink } from "react-router-dom";
import { ShoppingBag, PlusCircle, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  communitySlug: string;
};

export default function Sidebar({ communitySlug }: SidebarProps) {
  const { isAuthenticated } = useAuth();
  const base = `/c/${communitySlug}`;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col gap-1 border-r border-gray-200 bg-white px-3 py-6 sticky top-0 h-[calc(100vh-65px)] overflow-y-auto">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Navigation
      </p>
      <NavLink to={base} end className={linkClass}>
        <ShoppingBag size={18} />
        Browse Listings
      </NavLink>
      {isAuthenticated ? (
        <>
          <NavLink to={`${base}/new`} className={linkClass}>
            <PlusCircle size={18} />
            Post a Listing
          </NavLink>
          <NavLink to={`${base}/my-listings`} className={linkClass}>
            <ClipboardList size={18} />
            Manage
          </NavLink>
        </>
      ) : (
        <p className="mt-4 px-3 text-xs text-gray-400">
          Login to post or manage your listings.
        </p>
      )}
    </aside>
  );
}
