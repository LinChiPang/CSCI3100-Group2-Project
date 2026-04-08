import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createListing, getCommunityRule } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { CommunityRule } from "../types/marketplace";

export default function CreateListingPage() {
  const { community_slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communityRule, setCommunityRule] = useState<CommunityRule | null>(null);

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

  const maxPrice = communityRule?.max_price ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (maxPrice !== null && priceNum > maxPrice) {
      setError(`Price cannot exceed the community maximum of $${maxPrice}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const item = await createListing(title.trim(), description.trim(), priceNum);
      navigate(`/c/${community_slug}/items/${item.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Post a Listing</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item — condition, brand, etc."
            rows={4}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (HKD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              $
            </span>
            <input
              id="price"
              type="number"
              min="0"
              max={maxPrice ?? undefined}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          {maxPrice !== null && parseFloat(price) > maxPrice && (
            <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              Price cannot exceed the community maximum of ${maxPrice}. Contact your community admin for more details.
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Posting…" : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
