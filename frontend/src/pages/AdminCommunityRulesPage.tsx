import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCommunityRule, updateCommunityRule } from "../services/api";
import type { CommunityRule } from "../types/marketplace";

// All possible categories an admin can enable/disable
const ALL_CATEGORIES = [
  "books",
  "electronics",
  "furniture",
  "kitchen",
  "lifestyle",
  "others",
  "sports",
  "stationery",
  "clothing",
];

export default function AdminCommunityRulesPage() {
  const { community_slug } = useParams<{ community_slug: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [rule, setRule] = useState<CommunityRule | null>(null);
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [maxActiveListings, setMaxActiveListings] = useState<string>("5");
  const [postingEnabled, setPostingEnabled] = useState(true);
  const [allowedCategories, setAllowedCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auth guard — wait for auth, then verify admin of this community
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }
  }, [user, loading, navigate]);

  // Load existing rule
  useEffect(() => {
    if (!community_slug) return;
    getCommunityRule(community_slug)
      .then((r) => {
        if (!r) return;
        setRule(r);
        setMaxPrice(r.max_price != null ? String(r.max_price) : "");
        setMaxActiveListings(String(r.max_active_listings));
        setPostingEnabled(r.posting_enabled);
        setAllowedCategories(r.allowed_categories);
      })
      .catch(() => setError("Failed to load community rules."));
  }, [community_slug]);

  function toggleCategory(cat: string) {
    setAllowedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat].sort()
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!community_slug) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const parsedMax = maxPrice.trim() === "" ? null : Number(maxPrice);
    if (maxPrice.trim() !== "" && (isNaN(parsedMax!) || parsedMax! <= 0)) {
      setError("Max price must be a positive number, or leave blank for no limit.");
      setSaving(false);
      return;
    }
    const parsedListings = parseInt(maxActiveListings, 10);
    if (isNaN(parsedListings) || parsedListings < 1) {
      setError("Max active listings must be at least 1.");
      setSaving(false);
      return;
    }

    try {
      const updated = await updateCommunityRule(community_slug, {
        max_price: parsedMax,
        max_active_listings: parsedListings,
        posting_enabled: postingEnabled,
        allowed_categories: allowedCategories,
      });
      setRule(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rules.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !rule) {
    return (
      <p className="mt-12 text-center text-sm text-gray-500">Loading…</p>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">Community Rules</h1>
        <p className="mb-6 text-sm text-gray-500">
          Changes apply immediately to all members of this community.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Rules saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Posting enabled */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Allow posting</p>
              <p className="text-xs text-gray-500">Members can create new listings</p>
            </div>
            <button
              type="button"
              onClick={() => setPostingEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                postingEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
              role="switch"
              aria-checked={postingEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  postingEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Max price */}
          <div>
            <label className="block text-sm font-medium text-gray-900" htmlFor="max_price">
              Max price (HKD)
            </label>
            <p className="mb-1.5 text-xs text-gray-500">Leave blank for no limit</p>
            <input
              id="max_price"
              type="number"
              min="1"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Max active listings */}
          <div>
            <label className="block text-sm font-medium text-gray-900" htmlFor="max_listings">
              Max active listings per user
            </label>
            <input
              id="max_listings"
              type="number"
              min="1"
              step="1"
              required
              value={maxActiveListings}
              onChange={(e) => setMaxActiveListings(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Allowed categories */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-900">Allowed categories</p>
            <p className="mb-3 text-xs text-gray-500">
              Uncheck all to allow any category.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <label key={cat} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={allowedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                  />
                  <span className="text-sm capitalize text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
    </div>
  );
}
