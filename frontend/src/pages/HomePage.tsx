import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";
import ListingsGrid from "../components/ListingsGrid";
import SearchBar from "../components/SearchBar";
import SortSelect, { type SortKey } from "../components/SortSelect";
import CommunityRuleBanner from "../components/CommunityRuleBanner";
import { getCommunityRule, getListings } from "../services/api";
import type { CommunityRule, FilterParams, Item } from "../types/marketplace";
import { filterMinExceedsCommunityMax } from "../utils/communityRules";

export default function HomePage() {
  const { community_slug } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [draftFilters, setDraftFilters] = useState<FilterParams>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterParams>({});
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [draftSearch, setDraftSearch] = useState("");
  const [communityRule, setCommunityRule] = useState<CommunityRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const communitySlug = useMemo(() => community_slug ?? "", [community_slug]);

  const applySearch = (overrideSearch?: string) => {
    const trimmed = (overrideSearch ?? draftSearch).trim();
    setAppliedFilters((prev) => ({
      ...prev,
      search: trimmed ? trimmed : undefined,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters((prev) => ({
      ...draftFilters,
      search: prev.search,
    }));
  };

  const resetAll = () => {
    setDraftSearch("");
    setDraftFilters({});
    setAppliedFilters({});
  };

  useEffect(() => {
    if (!communitySlug) return;

    async function loadRule() {
      try {
        setError(null);
        const ruleRes = await getCommunityRule(communitySlug);
        setCommunityRule(ruleRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load community data");
      }
    }

    void loadRule();
  }, [communitySlug]);

  useEffect(() => {
    if (!communitySlug) return;

    async function loadListings() {
      try {
        setIsLoading(true);
        setError(null);

        const listingsRes = await getListings(communitySlug, appliedFilters);
        setItems(listingsRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listings");
      } finally {
        setIsLoading(false);
      }
    }

    void loadListings();
  }, [communitySlug, appliedFilters]);

  const ruleWarnings = useMemo(() => {
    const messages: string[] = [];
    if (!communityRule) return messages;
    if (filterMinExceedsCommunityMax(communityRule, appliedFilters.minPrice)) {
      messages.push(
        `Your min price filter (${appliedFilters.minPrice}) is above this community's limit (${communityRule.max_price}). Results may be empty.`,
      );
    }
    return messages;
  }, [communityRule, appliedFilters.minPrice]);

  const sortedItems = useMemo(() => {
    const copy = [...items];
    if (sortKey === "price_asc") copy.sort((a, b) => a.price - b.price);
    if (sortKey === "price_desc") copy.sort((a, b) => b.price - a.price);
    if (sortKey === "status") {
      const rank: Record<Item["status"], number> = { available: 0, reserved: 1, sold: 2 };
      copy.sort((a, b) => rank[a.status] - rank[b.status]);
    }
    return copy;
  }, [items, sortKey]);

  if (!communitySlug) {
    return <p className="text-gray-700">Please select a community.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-700">Loading community data...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">Community: {communitySlug}</h2>
        {communityRule && (
          <p className="mt-1 text-sm text-gray-600">
            Rules: {communityRule.posting_enabled ? "posting enabled" : "posting disabled"} · max active{" "}
            {communityRule.max_active_listings}
            {communityRule.max_price !== null ? ` · max price ${communityRule.max_price}` : ""}
          </p>
        )}
      </section>

      <CommunityRuleBanner rule={communityRule} />
      {ruleWarnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {ruleWarnings.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Listings ({sortedItems.length})</h3>
            <SortSelect variant="inline" value={sortKey} onChange={setSortKey} />
          </div>
          <ListingsGrid items={sortedItems} communitySlug={communitySlug} />
        </div>

        <div className="space-y-3 md:col-span-1">
          <SearchBar value={draftSearch} onChange={setDraftSearch} onSubmit={applySearch} />
          <FilterPanel
            value={draftFilters}
            communityRule={communityRule}
            onChange={setDraftFilters}
            onApply={() => applyFilters()}
            onReset={resetAll}
          />
        </div>
      </div>
    </div>
  );
}

