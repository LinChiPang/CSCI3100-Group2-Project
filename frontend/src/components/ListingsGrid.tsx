import type { Item } from "../types/marketplace";
import ListingCard from "./ListingCard";

type ListingsGridProps = {
  items: Item[];
  communitySlug: string;
};

export default function ListingsGrid({ items, communitySlug }: ListingsGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
        No listings match your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((item) => (
        <ListingCard key={item.id} item={item} communitySlug={communitySlug} />
      ))}
    </div>
  );
}

