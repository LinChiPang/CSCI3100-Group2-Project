import type { CommunityRule } from "../types/marketplace";

export function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

export function isCategoryAllowedByRule(rule: CommunityRule | null, category: string) {
  if (!rule || rule.allowed_categories.length === 0) return true;
  return rule.allowed_categories.includes(normalizeCategory(category));
}

export function itemPriceExceedsMax(rule: CommunityRule | null, priceCents: number) {
  if (!rule || rule.max_price === null) return false;
  return priceCents / 100 > Number(rule.max_price);
}

/** True when the user's min price filter is above the community's per-listing max (no items can match). */
export function filterMinExceedsCommunityMax(rule: CommunityRule | null, filterMinPrice?: number) {
  if (!rule || rule.max_price === null || filterMinPrice === undefined) return false;
  return filterMinPrice > Number(rule.max_price);
}
