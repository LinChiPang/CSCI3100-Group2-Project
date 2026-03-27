import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getItemDetail } from "../services/api";
import type { Item } from "../types/marketplace";

export default function ItemDetailPage() {
  const { community_slug, itemId } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getItemDetail(Number(itemId));
        setItem(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item detail");
      } finally {
        setIsLoading(false);
      }
    }

    void loadItem();
  }, [itemId]);

  if (isLoading) return <p className="text-gray-700">Loading item detail...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p className="text-gray-700">Item not found.</p>;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">Community: {community_slug}</p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">{item.title}</h2>
      <p className="mt-2 text-gray-700">{item.description}</p>
      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p>Category: {item.category}</p>
        <p>Status: {item.status}</p>
        <p>Seller: {item.seller_name}</p>
        <p>Price: ${Math.round(item.price_cents / 100)}</p>
      </div>
      <div className="mt-4">
        <Link to={`/c/${community_slug}`} className="text-sm text-blue-600 hover:underline">
          Back to listings
        </Link>
      </div>
    </section>
  );
}

