import type { CommunityRule, FilterParams, ItemStatus } from "../types/marketplace";
import { titleCase } from "../utils/format";

type FilterPanelProps = {
  value: FilterParams;
  communityRule: CommunityRule | null;
  onChange: (next: FilterParams) => void;
  onApply: () => void;
  onReset: () => void;
};

const allStatuses: ItemStatus[] = ["available", "reserved", "sold"];

function toggleInList<T>(list: T[] | undefined, value: T) {
  const current = list ?? [];
  if (current.includes(value)) return current.filter((x) => x !== value);
  return [...current, value];
}

export default function FilterPanel({ value, communityRule, onChange, onApply, onReset }: FilterPanelProps) {
  const allowedCategories = communityRule?.allowed_categories ?? [];
  const categories = allowedCategories.length > 0 ? allowedCategories : ["textbook", "furniture", "electronics"];

  const maxPriceFromRule = communityRule?.max_price ?? null;
  const priceMax = maxPriceFromRule ?? 2000;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-gray-900"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <p className="text-xs font-medium text-gray-700">Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {allStatuses.map((status) => {
              const checked = (value.statuses ?? []).includes(status);
              return (
                <label
                  key={status}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
                    checked ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => onChange({ ...value, statuses: toggleInList(value.statuses, status) })}
                  />
                  {titleCase(status)}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700">Categories</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const checked = (value.categories ?? []).includes(cat);
              return (
                <label
                  key={cat}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
                    checked ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => onChange({ ...value, categories: toggleInList(value.categories, cat) })}
                  />
                  {titleCase(cat)}
                </label>
              );
            })}
          </div>
          {allowedCategories.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">Restricted by community rules.</p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700">Price range (HKD)</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600" htmlFor="minPrice">
                Min
              </label>
              <input
                id="minPrice"
                type="number"
                min={0}
                max={priceMax}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                value={value.minPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    minPrice: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600" htmlFor="maxPrice">
                Max
              </label>
              <input
                id="maxPrice"
                type="number"
                min={0}
                max={priceMax}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                value={value.maxPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    maxPrice: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          {maxPriceFromRule !== null && (
            <p className="mt-2 text-xs text-gray-500">Community max price: {maxPriceFromRule}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-5 w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
      >
        Apply filters
      </button>
    </div>
  );
}

