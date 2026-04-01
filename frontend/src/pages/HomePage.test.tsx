import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import HomePage from "./HomePage";
import * as apiModule from "../services/api";
import type { CommunityRule, Item } from "../types/marketplace";

vi.mock("../services/api");

const mockCommunityRule: CommunityRule = {
  community_id: 1,
  max_price: 500,
  max_active_listings: 10,
  posting_enabled: true,
  allowed_categories: ["books", "electronics"],
};

const mockItems: Item[] = [
  {
    id: 1,
    community_slug: "hall-1",
    title: "Math Textbook",
    description: "Calculus",
    price_cents: 5000,
    status: "available",
    category: "books",
    seller_name: "Alice",
  },
  {
    id: 2,
    community_slug: "hall-1",
    title: "Laptop Stand",
    description: "Metal stand",
    price_cents: 15000,
    status: "sold",
    category: "electronics",
    seller_name: "Bob",
  },
];

function renderWithRouter(element: React.ReactElement, initialPath = "/c/hall-1") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/c/:community_slug" element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays community rule and listings", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getListings).mockResolvedValue({
      items: mockItems,
      meta: { total: 2, filters_applied: {} },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Math Textbook")).toBeInTheDocument();
      expect(screen.getByText("Laptop Stand")).toBeInTheDocument();
    });
  });

  it("displays empty state when no listings match filters", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getListings).mockResolvedValue({
      items: [],
      meta: { total: 0, filters_applied: {} },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/No listings match your filters/i)).toBeInTheDocument();
    });
  });

  it("sorts items by price ascending", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getListings).mockResolvedValue({
      items: mockItems,
      meta: { total: 2, filters_applied: {} },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Math Textbook")).toBeInTheDocument();
    });

    const sortSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(sortSelect, "price_asc");

    // Verify the dropdown changed
    expect(sortSelect).toHaveValue("price_asc");
  });

  it("applies filters when Apply button clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getListings).mockResolvedValue({
      items: mockItems,
      meta: { total: 2, filters_applied: {} },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Math Textbook")).toBeInTheDocument();
    });

    const minPriceInput = screen.getByLabelText(/Min/i);
    await user.clear(minPriceInput);
    await user.type(minPriceInput, "100");

    const applyButton = screen.getByRole("button", { name: /apply filters/i });
    await user.click(applyButton);

    // Verify API was called with filters
    await waitFor(() => {
      expect(apiModule.getListings).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        minPrice: 100,
      }));
    });
  });

  it("resets filters when Reset button clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getListings).mockResolvedValue({
      items: mockItems,
      meta: { total: 2, filters_applied: {} },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Math Textbook")).toBeInTheDocument();
    });

    const minPriceInput = screen.getByLabelText(/Min/i);
    await user.clear(minPriceInput);
    await user.type(minPriceInput, "100");

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    await user.click(resetButton);

    // Verify input is cleared
    expect(minPriceInput).toHaveValue(null);
  });

  it("displays community rule banner", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getListings).mockResolvedValue({
      items: mockItems,
      meta: { total: 2, filters_applied: {} },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Math Textbook")).toBeInTheDocument();
    });

    // CommunityRuleBanner should be present
    expect(screen.getByText(/Community Rules/i)).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    vi.mocked(apiModule.getCommunityRule).mockRejectedValue(new Error("API Error"));
    vi.mocked(apiModule.getListings).mockRejectedValue(new Error("API Error"));

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });
});
