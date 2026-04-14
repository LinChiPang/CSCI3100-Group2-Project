import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteItem, getListings } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Item } from "../types/marketplace";
import { formatDollars, titleCase } from "../utils/format";
import { useCommunityItemUpdates } from "../hooks/useCommunityItemUpdates";

function statusClass(status: Item["status"]) {
  switch (status) {
    case "available": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "reserved":  return "bg-amber-50 text-amber-700 border-amber-200";
    case "sold":      return "bg-gray-100 text-gray-700 border-gray-200";
    default:          return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function ManageCard({
  item,
  communitySlug,
  showActions,
  onDelete,
}: {
  item: Item;
  communitySlug: string;
  showActions: boolean;
  onDelete: (id: number) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await deleteItem(item.id);
      onDelete(item.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{formatDollars(item.price)}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-xs ${statusClass(item.status)}`}>
          {titleCase(item.status)}
        </span>
      </div>
      {deleteError && <p className="mt-2 text-xs text-red-600">{deleteError}</p>}
      <div className="mt-3 flex items-center gap-2">
        <Link
          to={`/c/${communitySlug}/items/${item.id}`}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          View
        </Link>
        {showActions && (
          <>
            <Link
              to={`/c/${communitySlug}/items/${item.id}/edit`}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MyListingsPage() {
  const { community_slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const communitySlug = community_slug ?? "";
  const userId = user?.id ?? null;

  const [posted, setPosted] = useState<Item[]>([]);
  const [reserved, setReserved] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    if (!isAuthenticated || userId === null) return;

    try {
      setIsLoading(true);
      setError(null);
      const all = await getListings(communitySlug, {});
      setPosted(all.filter((item) => item.user_id === userId));
      setReserved(
        all.filter((item) => item.reserved_by_id === userId && item.status === "reserved"),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings.");
    } finally {
      setIsLoading(false);
    }
  }, [communitySlug, isAuthenticated, userId]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    void loadListings();
  }, [isAuthenticated, loadListings, loading, navigate]);

  const handleItemStatusChanged = useCallback(() => {
    if (!loading && isAuthenticated && userId !== null) void loadListings();
  }, [isAuthenticated, loadListings, loading, userId]);

  useCommunityItemUpdates(userId, handleItemStatusChanged);

  const handleDeleted = (id: number) => {
    setPosted((prev) => prev.filter((item) => item.id !== id));
  };

  if (isLoading) return <p className="text-gray-600">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-gray-900">Manage</h1>

      {/* Items Posted */}
      <section>
        <h2 className="mb-4 text-lg font-medium text-gray-800">Items Posted</h2>
        {posted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-500">You haven't posted any listings yet.</p>
            <button
              onClick={() => navigate(`/c/${communitySlug}/new`)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Post your first listing
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posted.map((item) => (
              <ManageCard
                key={item.id}
                item={item}
                communitySlug={communitySlug}
                showActions
                onDelete={handleDeleted}
              />
            ))}
          </div>
        )}
      </section>

      {/* Items Reserved */}
      <section>
        <h2 className="mb-4 text-lg font-medium text-gray-800">Items Reserved</h2>
        {reserved.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-500">You haven't reserved any items yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reserved.map((item) => (
              <ManageCard
                key={item.id}
                item={item}
                communitySlug={communitySlug}
                showActions={false}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
