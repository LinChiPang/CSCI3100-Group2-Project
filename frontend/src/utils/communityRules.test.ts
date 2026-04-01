import { describe, expect, it } from "vitest";
import { filterMinExceedsCommunityMax, itemPriceExceedsMax, isCategoryAllowedByRule } from "./communityRules";
import type { CommunityRule } from "../types/marketplace";

const rule: CommunityRule = {
  community_id: 1,
  max_price: 100,
  max_active_listings: 5,
  posting_enabled: true,
  allowed_categories: ["books", "electronics"],
};

describe("communityRules", () => {
  it("detects price above community max", () => {
    expect(itemPriceExceedsMax(rule, 10001)).toBe(true);
    expect(itemPriceExceedsMax(rule, 10000)).toBe(false);
  });

  it("allows category when list empty", () => {
    const open: CommunityRule = { ...rule, allowed_categories: [] };
    expect(isCategoryAllowedByRule(open, "Anything")).toBe(true);
  });

  it("checks allowed categories case-insensitively", () => {
    expect(isCategoryAllowedByRule(rule, "Books")).toBe(true);
    expect(isCategoryAllowedByRule(rule, "furniture")).toBe(false);
  });

  it("detects min price filter above community max", () => {
    expect(filterMinExceedsCommunityMax(rule, 101)).toBe(true);
    expect(filterMinExceedsCommunityMax(rule, 100)).toBe(false);
    expect(filterMinExceedsCommunityMax(rule, undefined)).toBe(false);
  });
});
