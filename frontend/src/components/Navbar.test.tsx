import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";
import { AuthProvider } from "../context/AuthContext";

describe("Navbar", () => {
  function renderNavbar() {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>,
    );
  }

  it("displays title", () => {
    renderNavbar();
    expect(screen.getByText("Second-hand Marketplace")).toBeInTheDocument();
  });

  it("displays subtitle", () => {
    renderNavbar();
    expect(screen.getByText("CSCI3100 Group 2 Project")).toBeInTheDocument();
  });

  it("renders home link pointing to /", () => {
    renderNavbar();
    const homeLink = screen.getByRole("link", { name: "Second-hand Marketplace" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("shows Login button when not authenticated", () => {
    renderNavbar();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("does not show community switcher", () => {
    renderNavbar();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
