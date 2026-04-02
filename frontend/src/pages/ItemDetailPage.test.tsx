import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ItemDetailPage from "./ItemDetailPage";
import * as apiModule from "../services/api";
import type { CommunityRule, Item } from "../types/marketplace";

vi.mock("../services/api");

const mockItem: Item = {
  id: 42,
  community_id: 1,
  user_id: 5,
  seller_name: "alice",
  title: "Physics Textbook",
  description: "Advanced Physics for engineers",
  price: 80,
  status: "available",
  created_at: "2026-03-20T10:00:00Z",
  updated_at: "2026-03-20T10:00:00Z",
};

const mockCommunityRule: CommunityRule = {
  community_id: 1,
  max_price: 500,
  max_active_listings: 10,
  posting_enabled: true,
  allowed_categories: ["books", "electronics"],
};

function renderWithRouter(element: React.ReactElement, initialPath = "/c/hall-1/items/42") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/c/:community_slug/items/:itemId" element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ItemDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays item details", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
      expect(screen.getByText("Advanced Physics for engineers")).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  it("displays item price", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/HK\$|80/)).toBeInTheDocument();
    });
  });

  it("shows status workflow", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Available")).toBeInTheDocument();
      expect(screen.getByText("Reserved")).toBeInTheDocument();
      expect(screen.getByText("Sold")).toBeInTheDocument();
    });
  });

  it("displays Reserve button when available", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Reserve/i })).toBeInTheDocument();
    });
  });

  it("disables Reserve when item is reserved", async () => {
    const reservedItem = { ...mockItem, status: "reserved" as const };
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(reservedItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      const reserveButton = screen.getByRole("button", { name: /Reserve/i });
      expect(reserveButton).toBeDisabled();
    });
  });

  it("displays Mark as Sold button when reserved", async () => {
    const reservedItem = { ...mockItem, status: "reserved" as const };
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(reservedItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Mark as Sold/i })).toBeInTheDocument();
    });
  });

  it("calls reserveItem when Reserve button clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);
    vi.mocked(apiModule.reserveItem).mockResolvedValue({
      ...mockItem,
      status: "reserved",
    });

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
    });

    const reserveButton = screen.getByRole("button", { name: /Reserve/i });
    await user.click(reserveButton);

    await waitFor(() => {
      expect(apiModule.reserveItem).toHaveBeenCalledWith(42);
    });
  });

  it("calls sellItem when Mark as Sold button clicked", async () => {
    const user = userEvent.setup();
    const reservedItem = { ...mockItem, status: "reserved" as const };
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(reservedItem);
    vi.mocked(apiModule.sellItem).mockResolvedValue({
      ...reservedItem,
      status: "sold",
    });

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
    });

    const sellButton = screen.getByRole("button", { name: /Mark as Sold/i });
    await user.click(sellButton);

    await waitFor(() => {
      expect(apiModule.sellItem).toHaveBeenCalledWith(42);
    });
  });

  it("displays error when price exceeds community max", async () => {
    const expensiveItem: Item = {
      ...mockItem,
      price: 600, // Exceeds 500 HKD max
    };
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(expensiveItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/exceeds the community max/i)).toBeInTheDocument();
    });
  });

  it("disables actions when price exceeds max", async () => {
    const expensiveItem: Item = {
      ...mockItem,
      price: 600, // Exceeds max
    };
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(expensiveItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      const reserveButton = screen.getByRole("button", { name: /Reserve/i });
      expect(reserveButton).toBeDisabled();
    });
  });

  it("displays Back to listings link", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Back to listings")).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    vi.mocked(apiModule.getCommunityRule).mockRejectedValue(new Error("API Error"));
    vi.mocked(apiModule.getItemDetail).mockRejectedValue(new Error("API Error"));

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });
});
