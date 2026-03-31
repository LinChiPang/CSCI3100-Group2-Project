import type { CommunityRule } from "../types/marketplace";

type CommunityRuleBannerProps = {
  rule: CommunityRule | null;
};

export default function CommunityRuleBanner({ rule }: CommunityRuleBannerProps) {
  if (!rule || rule.posting_enabled) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      New listings are currently <span className="font-semibold">disabled</span> for this community.
    </div>
  );
}
