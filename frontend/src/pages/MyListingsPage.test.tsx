import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyListingsPage from "./MyListingsPage";
import * as apiModule from "../services/api";
import type { Item } from "../types/marketplace";
import { useCommunityItemUpdates } from "../hooks/useCommunityItemUpdates";

vi.mock("../services/api");
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 7, email: "seller@cuhk.edu.hk", community_id: 1 },
    isAuthenticated: true,
    loading: false,
    login: vi.fn(),
    setSession: vi.fn(),
    logout: vi.fn(),
  }),
}));
vi.mock("../hooks/useCommunityItemUpdates", () => ({
  useCommunityItemUpdates: vi.fn(),
}));

const ownedItem: Item = {
  id: 1,
  community_id: 1,
  user_id: 7,
  reserved_by_id: null,
  seller_name: "seller",
  title: "Owned Book",
  description: "Used book",
  price: 80,
  status: "available",
  category: "books",
  created_at: "2026-03-20T10:00:00Z",
  updated_at: "2026-03-20T10:00:00Z",
};

const reservedItem: Item = {
  id: 2,
  community_id: 1,
  user_id: 8,
  reserved_by_id: 7,
  seller_name: "peer",
  title: "Reserved Lamp",
  description: "Desk lamp",
  price: 60,
  status: "reserved",
  category: "furniture",
  created_at: "2026-03-20T11:00:00Z",
  updated_at: "2026-03-20T11:00:00Z",
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/c/hall-1/my-listings"]}>
      <Routes>
        <Route path="/c/:community_slug/my-listings" element={<MyListingsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MyListingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCommunityItemUpdates).mockImplementation(() => undefined);
  });

  it("re-fetches posted and reserved listings after realtime status changes", async () => {
    vi.mocked(apiModule.getListings)
      .mockResolvedValueOnce([ownedItem])
      .mockResolvedValueOnce([ownedItem, reservedItem]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Owned Book")).toBeInTheDocument();
      expect(screen.queryByText("Reserved Lamp")).not.toBeInTheDocument();
    });

    const onItemStatusChanged = vi.mocked(useCommunityItemUpdates).mock.calls.at(-1)?.[1];
    expect(onItemStatusChanged).toBeDefined();

    act(() => {
      onItemStatusChanged?.({ item_id: 2, status: "reserved", reserved_by_id: 7 });
    });

    await waitFor(() => {
      expect(apiModule.getListings).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Reserved Lamp")).toBeInTheDocument();
    });
  });
});
