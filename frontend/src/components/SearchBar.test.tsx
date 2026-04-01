import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder", () => {
    render(
      <SearchBar value="" onChange={() => {}} onSubmit={() => {}} />,
    );
    expect(screen.getByPlaceholderText(/Search title/i)).toBeInTheDocument();
  });

  it("updates input value on change", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchBar value="" onChange={onChange} onSubmit={() => {}} />,
    );
    const input = screen.getByPlaceholderText(/Search title/i);
    await user.type(input, "textbook");
    // onChange is called for each character, so just verify it was called
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onSubmit when Search button clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <SearchBar value="test" onChange={() => {}} onSubmit={onSubmit} />,
    );
    const button = screen.getByRole("button", { name: /Search/i });
    await user.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when Enter is pressed in input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <SearchBar value="" onChange={() => {}} onSubmit={onSubmit} />,
    );
    const input = screen.getByPlaceholderText(/Search title/i);
    await user.type(input, "{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays the current search value", () => {
    render(
      <SearchBar value="electronics" onChange={() => {}} onSubmit={() => {}} />,
    );
    const input = screen.getByDisplayValue("electronics");
    expect(input).toBeInTheDocument();
  });
});
