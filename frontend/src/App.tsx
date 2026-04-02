import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListingPage from "./pages/CreateListingPage";
import MyListingsPage from "./pages/MyListingsPage";
import { getCommunities } from "./services/api";
import { AuthProvider } from "./context/AuthContext";
import type { Community } from "./types/marketplace";

function CommunityLayout() {
  const { community_slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar communitySlug={community_slug ?? ""} />
        <main className="flex-1 min-w-0 px-4 py-6">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="items/:itemId" element={<ItemDetailPage />} />
            <Route path="new" element={<CreateListingPage />} />
            <Route path="my-listings" element={<MyListingsPage />} />
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

  const fallbackSlug = communities[0]?.slug;
  if (!fallbackSlug) {
    return <p className="p-4 text-gray-700">No communities found.</p>;
  }

  return <Navigate to={`/c/${fallbackSlug}`} replace state={{ from: location.pathname }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/c/:community_slug/*" element={<CommunityLayout />} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </AuthProvider>
  );
}

