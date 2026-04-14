import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as apiModule from "./services/api";

vi.mock("./hooks/useNotifications", () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    markAllRead: vi.fn(),
    clearAll: vi.fn(),
  }),
}));

vi.mock("./services/api", () => ({
  getCommunities: vi.fn(),
  getCommunityRule: vi.fn(),
  getListings: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

const communities = [
  { id: 1, slug: "chung-chi-college", name: "Chung Chi College" },
  { id: 2, slug: "new-asia-college", name: "New Asia College" },
];

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App public routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiModule.getCommunities).mockResolvedValue(communities);
    vi.mocked(apiModule.getCommunityRule).mockResolvedValue(null);
    vi.mocked(apiModule.getListings).mockResolvedValue([]);
    vi.mocked(apiModule.login).mockResolvedValue({ id: 13, email: "user@cuhk.edu.hk", community_id: 2 });
    vi.mocked(apiModule.logout).mockResolvedValue(undefined);
  });

  it("shows register and login options to logged-out users on the landing page", async () => {
    renderApp("/");

    expect(await screen.findByRole("link", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("redirects logged-in users from the landing page to their community", async () => {
    localStorage.setItem("auth_token", "token");
    localStorage.setItem("user", JSON.stringify({ id: 10, email: "user@cuhk.edu.hk", community_id: 2 }));

    renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("user@cuhk.edu.hk")).toBeInTheDocument();
      expect(apiModule.getListings).toHaveBeenCalledWith("new-asia-college", {});
    });
    expect(screen.queryByRole("link", { name: "Register" })).not.toBeInTheDocument();
  });

  it("redirects logged-in users from login to their community", async () => {
    localStorage.setItem("auth_token", "token");
    localStorage.setItem("user", JSON.stringify({ id: 11, email: "user@link.cuhk.edu.hk", community_id: 2 }));

    renderApp("/login");

    await waitFor(() => {
      expect(screen.getByText("user@link.cuhk.edu.hk")).toBeInTheDocument();
      expect(apiModule.getListings).toHaveBeenCalledWith("new-asia-college", {});
    });
  });

  it("redirects logged-in users from register to their community", async () => {
    localStorage.setItem("auth_token", "token");
    localStorage.setItem("user", JSON.stringify({ id: 12, email: "user@cse.cuhk.edu.hk", community_id: 2 }));

    renderApp("/register");

    await waitFor(() => {
      expect(screen.getByText("user@cse.cuhk.edu.hk")).toBeInTheDocument();
      expect(apiModule.getListings).toHaveBeenCalledWith("new-asia-college", {});
    });
  });

  it("returns logged-in users to the public landing page after logout", async () => {
    const user = userEvent.setup();
    localStorage.setItem("auth_token", "token");
    localStorage.setItem("user", JSON.stringify({ id: 13, email: "buyer.shaw@cuhk.edu.hk", community_id: 2 }));

    renderApp("/c/new-asia-college");

    await screen.findByText("buyer.shaw@cuhk.edu.hk");
    await user.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(apiModule.logout).toHaveBeenCalled();
      expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
    });
    expect(screen.queryByText("buyer.shaw@cuhk.edu.hk")).not.toBeInTheDocument();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("keeps login mounted and shows errors during failed login requests", async () => {
    const user = userEvent.setup();
    vi.mocked(apiModule.login).mockRejectedValue({
      response: { data: { error: "Invalid email or password" } },
    });

    renderApp("/login");

    await user.type(await screen.findByLabelText("CUHK Email"), "user@cuhk.edu.hk");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(screen.getByLabelText("CUHK Email")).toHaveValue("user@cuhk.edu.hk");
    expect(screen.getByLabelText("Password")).toHaveValue("wrongpassword");
  });
});
