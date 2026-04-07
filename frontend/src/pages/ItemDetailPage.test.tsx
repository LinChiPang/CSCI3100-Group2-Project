import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ItemDetailPage from "./ItemDetailPage";
import { AuthProvider } from "../context/AuthContext";
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

function renderWithRouter(
  element: React.ReactElement,
  {
    initialPath = "/c/hall-1/items/42",
    storedUser,
  }: {
    initialPath?: string;
    storedUser?: { id: number; email: string; community_id: number; role?: string } | null;
  } = {},
) {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");

  if (storedUser) {
    localStorage.setItem("auth_token", "test-token");
    localStorage.setItem("user", JSON.stringify(storedUser));
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/c/:community_slug/items/:itemId" element={element} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("ItemDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("loads and displays item details", async () => {
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
      expect(screen.getByText("Advanced Physics for engineers")).toBeInTheDocument();
      expect(screen.getByText("alice")).toBeInTheDocument();
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

    renderWithRouter(<ItemDetailPage />, {
      storedUser: { id: 5, email: "alice@cuhk.edu.hk", community_id: 1 },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Mark as Sold/i })).toBeEnabled();
    });
  });

  it("calls reserveItem after successful mock checkout", async () => {
    const user = userEvent.setup();
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(mockItem);
    vi.mocked(apiModule.mockCheckout).mockResolvedValue({
      message: "ok",
      transaction: {
        id: 1,
        item_name: mockItem.title,
        amount_hkd: mockItem.price,
        provider_ref: "mock_ref",
        status: "paid",
      },
    });
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
    await user.click(await screen.findByRole("button", { name: /Pay HK\$80/i }));
    await user.click(await screen.findByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(apiModule.mockCheckout).toHaveBeenCalledWith("Physics Textbook", 80);
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

    renderWithRouter(<ItemDetailPage />, {
      storedUser: { id: 5, email: "alice@cuhk.edu.hk", community_id: 1 },
    });

    await waitFor(() => {
      expect(screen.getByText("Physics Textbook")).toBeInTheDocument();
    });

    const sellButton = screen.getByRole("button", { name: /Mark as Sold/i });
    await user.click(sellButton);

    await waitFor(() => {
      expect(apiModule.sellItem).toHaveBeenCalledWith(42);
    });
  });

  it("does not display price error banner when price exceeds community max", async () => {
    const expensiveItem: Item = {
      ...mockItem,
      price: 600, // Exceeds 500 HKD max
    };
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(mockCommunityRule);
    vi.mocked(apiModule.getItemDetail).mockResolvedValue(expensiveItem);

    renderWithRouter(<ItemDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(expensiveItem.title)).toBeInTheDocument();
    });
    expect(screen.queryByText(/exceeds the community max/i)).not.toBeInTheDocument();
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
