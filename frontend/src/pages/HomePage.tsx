import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";
import ListingsGrid from "../components/ListingsGrid";
import SearchBar from "../components/SearchBar";
import SortSelect, { type SortKey } from "../components/SortSelect";
import CommunityRuleBanner from "../components/CommunityRuleBanner";
import { getCommunityRule, getListings } from "../services/api";
import type { CommunityRule, FilterParams, Item, ItemStatus } from "../types/marketplace";
import { filterMinExceedsCommunityMax } from "../utils/communityRules";
import { useAuth } from "../context/AuthContext";
import { useCommunityItemUpdates } from "../hooks/useCommunityItemUpdates";

const listingQueryKeys = ["q", "status", "category", "min_price", "max_price"];
const validStatuses: ItemStatus[] = ["available", "reserved", "sold"];

function parseOptionalNumber(value: string | null) {
  if (value === null || value.trim() === "") return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseFiltersFromSearchParams(searchParams: URLSearchParams): FilterParams {
  const q = searchParams.get("q")?.trim();
  const statuses = searchParams
    .getAll("status")
    .filter((status): status is ItemStatus => validStatuses.includes(status as ItemStatus));
  const categories = searchParams.getAll("category").map((category) => category.trim()).filter(Boolean);
  const minPrice = parseOptionalNumber(searchParams.get("min_price"));
  const maxPrice = parseOptionalNumber(searchParams.get("max_price"));

  return {
    ...(q ? { search: q } : {}),
    ...(statuses.length > 0 ? { statuses } : {}),
    ...(categories.length > 0 ? { categories } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
  };
}

function writeListingFiltersToSearchParams(baseParams: URLSearchParams, filters: FilterParams) {
  const nextParams = new URLSearchParams(baseParams);
  listingQueryKeys.forEach((key) => nextParams.delete(key));

  const search = filters.search?.trim();
  if (search) nextParams.set("q", search);
  filters.statuses?.forEach((status) => nextParams.append("status", status));
  filters.categories?.forEach((category) => {
    const trimmed = category.trim();
    if (trimmed) nextParams.append("category", trimmed);
  });
  if (filters.minPrice !== undefined) nextParams.set("min_price", String(filters.minPrice));
  if (filters.maxPrice !== undefined) nextParams.set("max_price", String(filters.maxPrice));

  return nextParams;
}

export default function HomePage() {
  const { community_slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [draftFilters, setDraftFilters] = useState<FilterParams>({});
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [draftSearch, setDraftSearch] = useState("");
  const [communityRule, setCommunityRule] = useState<CommunityRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const communitySlug = useMemo(() => community_slug ?? "", [community_slug]);
  const queryString = searchParams.toString();
  const appliedFilters = useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(queryString)),
    [queryString],
  );

  useEffect(() => {
    setDraftSearch(appliedFilters.search ?? "");
    setDraftFilters({
      categories: appliedFilters.categories,
      minPrice: appliedFilters.minPrice,
      maxPrice: appliedFilters.maxPrice,
      statuses: appliedFilters.statuses,
    });
  }, [appliedFilters]);

  const applySearch = (overrideSearch?: string) => {
    const trimmed = (overrideSearch ?? draftSearch).trim();
    setSearchParams(writeListingFiltersToSearchParams(searchParams, {
      ...appliedFilters,
      search: trimmed ? trimmed : undefined,
    }));
  };

  const applyFilters = () => {
    setSearchParams(writeListingFiltersToSearchParams(searchParams, {
      ...draftFilters,
      search: appliedFilters.search,
    }));
  };

  const resetAll = () => {
    setDraftSearch("");
    setDraftFilters({});
    const nextParams = new URLSearchParams(searchParams);
    listingQueryKeys.forEach((key) => nextParams.delete(key));
    setSearchParams(nextParams);
  };

  const loadListings = useCallback(async (options: { showLoading?: boolean } = {}) => {
    if (!communitySlug) return;

    try {
      if (options.showLoading ?? true) setIsLoading(true);
      setError(null);

      const listingsRes = await getListings(communitySlug, appliedFilters);
      setItems(listingsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      if (options.showLoading ?? true) setIsLoading(false);
    }
  }, [communitySlug, appliedFilters]);

  // Real-time item status updates from other users' actions
  const handleItemStatusChanged = useCallback(
    () => {
      void loadListings({ showLoading: false });
    },
    [loadListings]
  );
  useCommunityItemUpdates(user?.id ?? null, handleItemStatusChanged);

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
    void loadListings();
  }, [loadListings]);

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
