import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommunityRuleBanner from "../components/CommunityRuleBanner";
import StatusWorkflow from "../components/StatusWorkflow";
import { sellItem, getCommunityRule, getItemDetail, reserveItem } from "../services/api";
import type { CommunityRule, Item } from "../types/marketplace";
import { itemPriceExceedsMax } from "../utils/communityRules";
import { formatDollars, titleCase } from "../utils/format";

export default function ItemDetailPage() {
  const { community_slug, itemId } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [communityRule, setCommunityRule] = useState<CommunityRule | null>(null);

  const numericItemId = useMemo(() => (itemId ? Number(itemId) : NaN), [itemId]);

  useEffect(() => {
    if (!community_slug) return;
    const communityKey: string = community_slug;
    async function loadRule() {
      try {
        const rule = await getCommunityRule(communityKey);
        setCommunityRule(rule);
      } catch {
        setCommunityRule(null);
      }
    }
    void loadRule();
  }, [community_slug]);

  useEffect(() => {
    if (!itemId) return;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getItemDetail(numericItemId);
        setItem(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item detail");
      } finally {
        setIsLoading(false);
      }
    }

    void loadItem();
  }, [itemId, numericItemId]);

  if (isLoading) return <p className="text-gray-700">Loading item detail...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p className="text-gray-700">Item not found.</p>;

  const overMaxPrice = itemPriceExceedsMax(communityRule, item.price);
  const ruleBlocksActions = overMaxPrice;

  const canReserve = item.status === "available" && !ruleBlocksActions;
  const canSell = item.status === "reserved" && !ruleBlocksActions;

  const handleReserve = async () => {
    if (!canReserve) return;
    try {
      setIsActionLoading(true);
      setActionError(null);
      const updated = await reserveItem(item.id);
      setItem(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reserve item");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSell = async () => {
    if (!canSell) return;
    try {
      setIsActionLoading(true);
      setActionError(null);
      const updated = await sellItem(item.id);
      setItem(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to mark as sold");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <CommunityRuleBanner rule={communityRule} />

      <p className="text-sm text-gray-500">Community: {community_slug}</p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">{item.title}</h2>
      <p className="mt-2 text-gray-700">{item.description}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <span className="text-gray-500">Seller ID:</span> {item.user_id}
          </p>
          <p>
            <span className="text-gray-500">Price:</span> {formatDollars(item.price)}
          </p>
          <p>
            <span className="text-gray-500">Posted:</span> {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <StatusWorkflow status={item.status} />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={!canReserve || isActionLoading}
          onClick={handleReserve}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Reserve
        </button>
        <button
          type="button"
          disabled={!canSell || isActionLoading}
          onClick={handleSell}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Mark as Sold
        </button>
      </div>
      {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}

      <div className="mt-4">
        <Link to={`/c/${community_slug}`} className="text-sm text-blue-600 hover:underline">
          Back to listings
        </Link>
      </div>
    </section>
  );
}

