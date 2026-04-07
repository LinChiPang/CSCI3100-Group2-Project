import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ListingCard from "./ListingCard";
import type { Item } from "../types/marketplace";

describe("ListingCard", () => {
  const mockItem: Item = {
    id: 42,
    community_id: 1,
    user_id: 5,
    reserved_by_id: null,
    seller_name: "alice",
    title: "Physics Textbook",
    description: "Good condition",
    price: 65,
    status: "available",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
  };

  it("renders item title and seller name", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
    expect(screen.getByText(/alice/)).toBeInTheDocument();
  });

  it("displays price in HKD", () => {
    render(
      <BrowserRouter>
        <ListingCard item={mockItem} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText(/HK\$|65/)).toBeInTheDocument();
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
