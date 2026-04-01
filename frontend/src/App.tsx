import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import { getCommunities } from "./services/api";
import type { Community } from "./types/marketplace";

function CommunityLayout() {
  const { community_slug } = useParams();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCommunities() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getCommunities();
        setCommunities(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load communities");
      } finally {
        setIsLoading(false);
      }
    }
    void loadCommunities();
  }, []);

  if (isLoading) return <p className="p-4 text-gray-700">Loading communities...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar communities={communities} currentSlug={community_slug} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="items/:itemId" element={<ItemDetailPage />} />
        </Routes>
      </main>
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
    <Routes>
      <Route path="/" element={<DefaultRedirect />} />
      <Route path="/c/:community_slug/*" element={<CommunityLayout />} />
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
}

