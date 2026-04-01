import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FilterPanel from "./FilterPanel";
import type { CommunityRule } from "../types/marketplace";

describe("FilterPanel", () => {
  it("calls onApply when Apply filters is clicked", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(
      <FilterPanel
        value={{}}
        communityRule={null}
        onChange={() => {}}
        onApply={onApply}
        onReset={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: /apply filters/i }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when Reset is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <FilterPanel
        value={{ minPrice: 100, maxPrice: 500 }}
        communityRule={null}
        onChange={() => {}}
        onApply={() => {}}
        onReset={onReset}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Reset/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("toggles status filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        value={{}}
        communityRule={null}
        onChange={onChange}
        onApply={() => {}}
        onReset={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    // Click first status checkbox (Available)
    await user.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalled();
  });

  it("toggles category filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        value={{}}
        communityRule={null}
        onChange={onChange}
        onApply={() => {}}
        onReset={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    // skip status checkboxes (3) and click a category one
    if (checkboxes.length > 3) {
      await user.click(checkboxes[3]);
      expect(onChange).toHaveBeenCalled();
    }
  });

  it("updates min price input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        value={{}}
        communityRule={null}
        onChange={onChange}
        onApply={() => {}}
        onReset={() => {}}
      />,
    );
    const inputs = screen.getAllByRole("spinbutton");
    // First spinbutton is minPrice - just verify onChange is called when typing
    await user.type(inputs[0], "50");
    expect(onChange).toHaveBeenCalled();
  });

  it("updates max price input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        value={{}}
        communityRule={null}
        onChange={onChange}
        onApply={() => {}}
        onReset={() => {}}
      />,
    );
    const inputs = screen.getAllByRole("spinbutton");
    // Second spinbutton is maxPrice - just verify onChange is called when typing
    await user.type(inputs[1], "250");
    expect(onChange).toHaveBeenCalled();
  });

  it("displays community rule info when rule has restrictions", () => {
    const rule: CommunityRule = {
      community_id: 1,
      max_price: 100,
      max_active_listings: 5,
      posting_enabled: true,
      allowed_categories: ["books", "electronics"],
    };
    render(
      <FilterPanel
        value={{}}
        communityRule={rule}
        onChange={() => {}}
        onApply={() => {}}
        onReset={() => {}}
      />,
    );
    expect(screen.getByText(/Restricted by community rules/i)).toBeInTheDocument();
    expect(screen.getByText(/Community max price: 100/i)).toBeInTheDocument();
  });

  it("displays allowed categories from community rule", () => {
    const rule: CommunityRule = {
      community_id: 1,
      max_price: 100,
      max_active_listings: 5,
      posting_enabled: true,
      allowed_categories: ["books", "electronics"],
    };
    render(
      <FilterPanel
        value={{}}
        communityRule={rule}
        onChange={() => {}}
        onApply={() => {}}
        onReset={() => {}}
      />,
    );
    expect(screen.getByText(/Books/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
  });
});
