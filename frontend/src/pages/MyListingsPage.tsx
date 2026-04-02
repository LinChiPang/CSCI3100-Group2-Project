import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListingsGrid from "../components/ListingsGrid";
import { getListings } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Item } from "../types/marketplace";

export default function MyListingsPage() {
  const { community_slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const communitySlug = community_slug ?? "";

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    async function load() {
      try {
        setIsLoading(true);
        const all = await getListings(communitySlug, {});
        setItems(all.filter((item) => item.user_id === user!.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listings.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [communitySlug, user, isAuthenticated, navigate]);

  if (isLoading) return <p className="text-gray-600">Loading your listings…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">My Listings</h1>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-500">You haven't posted any listings yet.</p>
          <button
            onClick={() => navigate(`/c/${communitySlug}/new`)}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Post your first listing
          </button>
        </div>
      ) : (
        <ListingsGrid items={items} communitySlug={communitySlug} />
      )}
    </div>
  );
}
