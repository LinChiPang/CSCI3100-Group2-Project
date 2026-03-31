import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ListingCard from "./ListingCard";
import type { Item } from "../types/marketplace";

describe("ListingCard", () => {
  const mockItem: Item = {
    id: 42,
    community_slug: "hall-1",
    title: "Physics Textbook",
    description: "Good condition",
    price_cents: 6500,
    status: "available",
    category: "books",
    seller_name: "Charlie",
  };

  it("renders item title and seller", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
    expect(screen.getByText(/Charlie/)).toBeInTheDocument();
  });

  it("displays price in HKD", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText(/HK\$|65/)).toBeInTheDocument();
  });

  it("displays category as title case", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Books/)).toBeInTheDocument();
  });

  it("shows status badge with correct styling for available", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    const statusBadge = screen.getByText("Available");
    expect(statusBadge).toHaveClass("bg-emerald-50");
  });

  it("shows status badge for reserved", () => {
    const reservedItem = { ...mockItem, status: "reserved" as const };
    render(
      <BrowserRouter>
        <ListingCard item={reservedItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    const statusBadge = screen.getByText("Reserved");
    expect(statusBadge).toHaveClass("bg-amber-50");
  });

  it("shows status badge for sold", () => {
    const soldItem = { ...mockItem, status: "sold" as const };
    render(
      <BrowserRouter>
        <ListingCard item={soldItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    const statusBadge = screen.getByText("Sold");
    expect(statusBadge).toHaveClass("bg-gray-100");
  });

  it("renders View link with correct href", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    const viewLink = screen.getByRole("link", { name: /View/i });
    expect(viewLink).toHaveAttribute("href", "/c/hall-1/items/42");
  });
});
