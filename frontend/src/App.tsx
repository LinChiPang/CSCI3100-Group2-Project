import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import MyListingsPage from "./pages/MyListingsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminCommunityRulesPage from "./pages/AdminCommunityRulesPage";
import { getCommunities } from "./services/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { Community } from "./types/marketplace";

function CommunityLayout() {
  const { community_slug } = useParams();
  const { user, loading } = useAuth();
  const [communities, setCommunities] = useState<Community[] | null>(null);

  useEffect(() => {
    if (community_slug) {
      localStorage.setItem("last_community_slug", community_slug);
    }
  }, [community_slug]);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await getCommunities();
        setCommunities(res);
      } catch {
        setCommunities([]);
      }
    }
    void loadCommunities();
  }, []);

  // Redirect authenticated users away from communities they don't belong to
  if (!loading && user && communities !== null) {
    const userSlug = communities.find((c) => c.id === user.community_id)?.slug;
    if (userSlug && community_slug !== userSlug) {
      return <Navigate to={`/c/${userSlug}`} replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar communitySlug={community_slug ?? ""} />
        <main className="flex-1 min-w-0 px-4 py-6">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="items/:itemId" element={<ItemDetailPage />} />
            <Route path="items/:itemId/edit" element={<EditListingPage />} />
            <Route path="new" element={<CreateListingPage />} />
            <Route path="my-listings" element={<MyListingsPage />} />
            <Route path="admin/rules" element={<AdminCommunityRulesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function DefaultRedirect() {
  const location = useLocation();
  const [communities, setCommunities] = useState<Community[] | null>(null);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await getCommunities();
        setCommunities(res);
      } catch {
        setCommunities([]);
      }
    }
    void loadCommunities();
  }, []);

  if (communities === null) return <p className="p-4 text-gray-700">Loading...</p>;

  const lastCommunitySlug = localStorage.getItem("last_community_slug");
  const hasLastCommunity = !!lastCommunitySlug && communities.some((c) => c.slug === lastCommunitySlug);
  const fallbackSlug = hasLastCommunity ? lastCommunitySlug : communities[0]?.slug;
  if (!fallbackSlug) {
    return <p className="p-4 text-gray-700">No communities found.</p>;
  }

  return <Navigate to={`/c/${fallbackSlug}`} replace state={{ from: location.pathname }} />;
}

function UserCommunityRedirect() {
  const location = useLocation();
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[] | null>(null);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await getCommunities();
        setCommunities(res);
      } catch {
        setCommunities([]);
      }
    }
    void loadCommunities();
  }, []);

  if (communities === null) return <p className="p-4 text-gray-700">Loading...</p>;

  const userCommunitySlug = communities.find((c) => c.id === user?.community_id)?.slug;
  const fallbackSlug = userCommunitySlug ?? communities[0]?.slug;
  if (!fallbackSlug) {
    return <p className="p-4 text-gray-700">No communities found.</p>;
  }

  return <Navigate to={`/c/${fallbackSlug}`} replace state={{ from: location.pathname }} />;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p className="p-4 text-gray-700">Loading...</p>;
  if (isAuthenticated) return <UserCommunityRedirect />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/c/:community_slug/*" element={<CommunityLayout />} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </AuthProvider>
  );
}
