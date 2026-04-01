import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusWorkflow from "./StatusWorkflow";

describe("StatusWorkflow", () => {
  it("shows Available as active for available status", () => {
    render(<StatusWorkflow status="available" />);
    expect(screen.getByText("Available")).toBeInTheDocument();
    const pill = screen.getByText("Available").closest("span");
    expect(pill).toHaveClass("bg-gray-900");
  });

  it("shows all steps in order", () => {
    render(<StatusWorkflow status="available" />);
    const steps = screen.getByText(/Available/);
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Reserved")).toBeInTheDocument();
    expect(screen.getByText("Sold")).toBeInTheDocument();
  });

  it("marks Available as done when status is Reserved", () => {
    render(<StatusWorkflow status="reserved" />);
    const availablePill = screen.getByText("Available").closest("span");
    expect(availablePill).toHaveClass("bg-emerald-50");
    
    const reservedPill = screen.getByText("Reserved").closest("span");
    expect(reservedPill).toHaveClass("bg-gray-900");
  });

  it("marks Available and Reserved as done when status is Sold", () => {
    render(<StatusWorkflow status="sold" />);
    const availablePill = screen.getByText("Available").closest("span");
    expect(availablePill).toHaveClass("bg-emerald-50");
    
    const reservedPill = screen.getByText("Reserved").closest("span");
    expect(reservedPill).toHaveClass("bg-emerald-50");
    
    const soldPill = screen.getByText("Sold").closest("span");
    expect(soldPill).toHaveClass("bg-gray-900");
  });

  it("displays status header", () => {
    render(<StatusWorkflow status="available" />);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
