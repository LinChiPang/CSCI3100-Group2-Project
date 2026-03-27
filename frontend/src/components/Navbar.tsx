import { Link, useNavigate } from "react-router-dom";
import type { Community } from "../types/marketplace";

type NavbarProps = {
  communities: Community[];
  currentSlug?: string;
};

export default function Navbar({ communities, currentSlug }: NavbarProps) {
  const navigate = useNavigate();

  const handleCommunityChange = (slug: string) => {
    navigate(`/c/${slug}`);
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to={currentSlug ? `/c/${currentSlug}` : "/"} className="text-xl font-semibold text-gray-900">
            Second-hand Marketplace
          </Link>
          <p className="text-sm text-gray-600">CSCI3100 Group 2 Project</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="community-switch" className="text-sm text-gray-700">
            Community
          </label>
          <select
            id="community-switch"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={currentSlug ?? ""}
            onChange={(event) => handleCommunityChange(event.target.value)}
          >
            <option value="" disabled>
              Select community
            </option>
            {communities.map((community) => (
              <option key={community.id} value={community.slug}>
                {community.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

