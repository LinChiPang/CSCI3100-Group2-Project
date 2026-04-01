export type SortKey = "newest" | "price_asc" | "price_desc" | "status";

type SortSelectProps = {
  value: SortKey;
  onChange: (value: SortKey) => void;
  /** `inline` fits the listings header row; `card` is the bordered sidebar style. */
  variant?: "card" | "inline";
};

export default function SortSelect({ value, onChange, variant = "card" }: SortSelectProps) {
  const select = (
    <select
      id="sort"
      className={
        variant === "inline"
          ? "min-w-[11rem] rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-gray-900"
          : "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
      }
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="status">Status</option>
    </select>
  );

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-gray-900" htmlFor="sort">
          Sort
        </label>
        {select}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-900" htmlFor="sort">
        Sort
      </label>
      {select}
    </div>
  );
}

