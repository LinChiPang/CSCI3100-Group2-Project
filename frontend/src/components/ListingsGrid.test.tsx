import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ListingsGrid from "./ListingsGrid";
import type { Item } from "../types/marketplace";

const mockItems: Item[] = [
  {
    id: 1,
    community_slug: "hall-1",
    title: "Calculus Textbook",
    description: "Used but in good condition",
    price_cents: 5000,
    status: "available",
    category: "books",
    seller_name: "Alice",
  },
  {
    id: 2,
    community_slug: "hall-1",
    title: "Laptop",
    description: "Gaming laptop",
    price_cents: 80000,
    status: "reserved",
    category: "electronics",
    seller_name: "Bob",
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
    // The category and seller are separated by a bullet point, so check they're both visible
    const container = screen.getByText("Calculus Textbook").closest("div");
    expect(container).toHaveTextContent("Books");
    expect(container).toHaveTextContent("Alice");
  });
});
