import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";
import { AuthProvider } from "../context/AuthContext";
import type { Community } from "../types/marketplace";

const mockCommunities: Community[] = [
  { id: 1, slug: "hall-1", name: "Hall 1" },
  { id: 2, slug: "hall-2", name: "Hall 2" },
];

describe("Navbar", () => {
  it("displays title", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(screen.getByText("Second-hand Marketplace")).toBeInTheDocument();
  });

  it("displays subtitle", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(screen.getByText("CSCI3100 Group 2 Project")).toBeInTheDocument();
  });

  it("displays all communities in dropdown", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} />
        </AuthProvider>
      </BrowserRouter>,
    );
    const select = screen.getByRole("combobox");
    expect(select.textContent).toContain("Hall 1");
    expect(select.textContent).toContain("Hall 2");
  });

  it("displays community label", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(screen.getByLabelText("Community")).toBeInTheDocument();
  });

  it("shows selected community", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} currentSlug="hall-1" />
        </AuthProvider>
      </BrowserRouter>,
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("hall-1");
  });

  it("shows placeholder when no community selected", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} />
        </AuthProvider>
      </BrowserRouter>,
    );
    const select = screen.getByRole("combobox");
    expect(select.textContent).toContain("Select community");
  });

  it("renders home link", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} />
        </AuthProvider>
      </BrowserRouter>,
    );
    const homeLink = screen.getByRole("link", { name: "Second-hand Marketplace" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders community-specific link when slug provided", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar communities={mockCommunities} currentSlug="hall-1" />
        </AuthProvider>
      </BrowserRouter>,
    );
    const communityLink = screen.getByRole("link", { name: "Second-hand Marketplace" });
    expect(communityLink).toHaveAttribute("href", "/c/hall-1");
  });
});
