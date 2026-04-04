import { Link } from "react-router-dom";
import type { Item } from "../types/marketplace";
import { formatDollars, titleCase } from "../utils/format";

type ListingCardProps = {
  item: Item;
  communitySlug: string;
};

function statusClass(status: Item["status"]) {
  switch (status) {
    case "available":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "reserved":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "sold":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function ListingCard({ item, communitySlug }: ListingCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="mt-1 text-xs text-gray-600">
            Seller: {item.seller_name}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-xs ${statusClass(item.status)}`}>
          {titleCase(item.status)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">{formatDollars(item.price)}</p>
        <Link
          to={`/c/${communitySlug}/items/${item.id}`}
          className="rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-black"
        >
          View
        </Link>
      </div>
    </div>
  );
}

