import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import * as apiModule from "../services/api";
import RegisterPage from "./RegisterPage";

vi.mock("../services/api", () => ({
  getCommunities: vi.fn(),
  register: vi.fn(),
}));

const communities = [
  { id: 1, slug: "chung-chi-college", name: "Chung Chi College" },
];

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiModule.getCommunities).mockResolvedValue(communities);
  });

  it("shows backend error messages from forbidden registration responses", async () => {
    const user = userEvent.setup();
    vi.mocked(apiModule.register).mockRejectedValue({
      response: { data: { error: "You are already signed in." } },
    });

    renderRegisterPage();

    await screen.findByRole("option", { name: "Chung Chi College" });
    await user.type(screen.getByLabelText("CUHK Email"), "user@link.cuhk.edu.hk");
    await user.type(screen.getByLabelText("Username"), "newuser");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("You are already signed in.")).toBeInTheDocument();
    });
  });
});
