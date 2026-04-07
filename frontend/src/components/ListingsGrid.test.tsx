import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ListingsGrid from "./ListingsGrid";
import type { Item } from "../types/marketplace";

const mockItems: Item[] = [
  {
    id: 1,
    community_id: 1,
    user_id: 1,
    reserved_by_id: null,
    seller_name: "alice",
    title: "Calculus Textbook",
    description: "Used but in good condition",
    price: 50,
    status: "available",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
  },
  {
    id: 2,
    community_id: 1,
    user_id: 2,
    reserved_by_id: null,
    seller_name: "bob",
    title: "Laptop",
    description: "Gaming laptop",
    price: 800,
    status: "reserved",
    created_at: "2026-03-20T10:05:00Z",
    updated_at: "2026-03-20T10:05:00Z",
  },
];

describe("ListingsGrid", () => {
  it("renders all items", () => {
    render(
      <BrowserRouter>
        <ListingsGrid items={mockItems} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText("Calculus Textbook")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
  });

  it("displays empty state when no items", () => {
    render(
      <BrowserRouter>
        <ListingsGrid items={[]} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText(/No listings match your filters/i)).toBeInTheDocument();
  });

  it("renders one item correctly", () => {
    render(
      <BrowserRouter>
        <ListingsGrid items={[mockItems[0]]} communitySlug="hall-1" />
      </BrowserRouter>,
    );
    expect(screen.getByText("Calculus Textbook")).toBeInTheDocument();
    // The item should display title and seller name
    const container = screen.getByText("Calculus Textbook").closest("div");
    expect(container).toHaveTextContent("Seller:");
  });
});
