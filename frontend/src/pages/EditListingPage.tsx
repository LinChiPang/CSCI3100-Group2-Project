import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCommunityRule, getItemDetail, updateItem } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { CommunityRule } from "../types/marketplace";

export default function EditListingPage() {
  const { community_slug, itemId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [communityRule, setCommunityRule] = useState<CommunityRule | null>(null);

  const numericItemId = itemId ? Number(itemId) : NaN;

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!community_slug) return;
    getCommunityRule(community_slug)
      .then(setCommunityRule)
      .catch(() => setCommunityRule(null));
  }, [community_slug]);

  useEffect(() => {
    if (!itemId) return;
    async function load() {
      try {
        setIsLoading(true);
        const item = await getItemDetail(numericItemId);
        // Only the owner can edit
        if (user && item.user_id !== user.id) {
          navigate(`/c/${community_slug}/items/${itemId}`);
          return;
        }
        setTitle(item.title);
        setDescription(item.description ?? "");
        setPrice(String(item.price));
      } catch {
        setError("Failed to load item.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [itemId, numericItemId, community_slug, user, navigate]);

  const maxPrice = communityRule?.max_price ?? null;
  const priceNum = parseFloat(price);
  const priceExceedsMax = maxPrice !== null && !isNaN(priceNum) && priceNum > maxPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (priceExceedsMax) {
      setError(`Price cannot exceed the community maximum of $${maxPrice}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateItem(numericItemId, title.trim(), description.trim(), priceNum);
      navigate(`/c/${community_slug}/items/${itemId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-gray-600">Loading…</p>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Edit Listing</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
            Price (HKD)
            {maxPrice !== null && (
              <span className="ml-2 text-xs text-gray-400">max ${maxPrice}</span>
            )}
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
              priceExceedsMax
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {priceExceedsMax && (
            <p className="mt-1 text-xs text-red-600">
              Price exceeds community maximum of ${maxPrice}.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || priceExceedsMax}
            className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/c/${community_slug}/items/${itemId}`)}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
