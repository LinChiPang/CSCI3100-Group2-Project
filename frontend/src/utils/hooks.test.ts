import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDebouncedValue } from "./hooks";

describe("useDebouncedValue", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("test", 500));
    expect(result.current).toBe("test");
  });

  it("debounces value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 100 } },
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 100 });
    expect(result.current).toBe("initial");

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("handles multiple updates with debounce", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "first", delay: 200 } },
    );

    rerender({ value: "second", delay: 200 });
    rerender({ value: "third", delay: 200 });
    expect(result.current).toBe("first");

    await waitFor(() => {
      expect(result.current).toBe("third");
    });
  });

  it("works with different delay values", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "test", delay: 50 } },
    );

    rerender({ value: "updated", delay: 50 });
    expect(result.current).toBe("test");

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("handles numeric values", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 100, delay: 100 } },
    );

    expect(result.current).toBe(100);

    rerender({ value: 200, delay: 100 });
    expect(result.current).toBe(100);

    await waitFor(() => {
      expect(result.current).toBe(200);
    });
  });
});
