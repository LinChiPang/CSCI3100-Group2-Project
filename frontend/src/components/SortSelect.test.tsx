import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SortSelect from "./SortSelect";

describe("SortSelect", () => {
  it("renders all sort options", () => {
    render(<SortSelect value="newest" onChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select.textContent).toContain("Newest");
    expect(select.textContent).toContain("Price: Low to High");
    expect(select.textContent).toContain("Price: High to Low");
    expect(select.textContent).toContain("Status");
  });

  it("calls onChange when sort option changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortSelect value="newest" onChange={onChange} />);
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "price_asc");
    expect(onChange).toHaveBeenCalledWith("price_asc");
  });

  it("displays current sort value", () => {
    render(<SortSelect value="price_desc" onChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("price_desc");
  });

  it("renders with card variant by default", () => {
    render(<SortSelect value="newest" onChange={() => {}} />);
    const container = screen.getByRole("combobox").closest("div");
    expect(container).toHaveClass("rounded-lg");
    expect(container).toHaveClass("border");
  });

  it("renders with inline variant when specified", () => {
    render(<SortSelect value="newest" onChange={() => {}} variant="inline" />);
    const label = screen.getByLabelText("Sort");
    expect(label).toBeInTheDocument();
  });

  it("displays label with Sort text", () => {
    render(<SortSelect value="newest" onChange={() => {}} />);
    expect(screen.getByText("Sort")).toBeInTheDocument();
  });

  it("handles all sort options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortSelect value="newest" onChange={onChange} />);
    const select = screen.getByRole("combobox");

    const options: Array<"newest" | "price_asc" | "price_desc" | "status"> = [
      "price_asc",
      "price_desc",
      "status",
    ];
    for (const option of options) {
      await user.selectOptions(select, option);
      expect(onChange).toHaveBeenCalledWith(option);
    }
  });
});
