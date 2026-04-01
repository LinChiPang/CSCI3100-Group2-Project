import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CommunityRuleBanner from "./CommunityRuleBanner";
import type { CommunityRule } from "../types/marketplace";

describe("CommunityRuleBanner", () => {
  it("does not render when rule is null", () => {
    const { container } = render(<CommunityRuleBanner rule={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when posting is enabled", () => {
    const rule: CommunityRule = {
      community_id: 1,
      max_price: 500,
      max_active_listings: 10,
      posting_enabled: true,
      allowed_categories: ["books"],
    };
    const { container } = render(<CommunityRuleBanner rule={rule} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when posting is disabled", () => {
    const rule: CommunityRule = {
      community_id: 1,
      max_price: 500,
      max_active_listings: 10,
      posting_enabled: false,
      allowed_categories: ["books"],
    };
    render(<CommunityRuleBanner rule={rule} />);
    expect(screen.getByText(/New listings are currently/i)).toBeInTheDocument();
  });

  it("displays disabled message with emphasis", () => {
    const rule: CommunityRule = {
      community_id: 1,
      max_price: 500,
      max_active_listings: 10,
      posting_enabled: false,
      allowed_categories: ["books"],
    };
    render(<CommunityRuleBanner rule={rule} />);
    expect(screen.getByText("disabled")).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const rule: CommunityRule = {
      community_id: 1,
      max_price: 500,
      max_active_listings: 10,
      posting_enabled: false,
      allowed_categories: ["books"],
    };
    const { container } = render(<CommunityRuleBanner rule={rule} />);
    const banner = container.querySelector("div");
    expect(banner).toHaveClass("rounded-lg");
    expect(banner).toHaveClass("bg-amber-50");
    expect(banner).toHaveClass("text-amber-900");
  });
});
