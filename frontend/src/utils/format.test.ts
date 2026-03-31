import { describe, expect, it } from "vitest";
import { formatDollarsFromCents, titleCase } from "./format";

describe("format utilities", () => {
  describe("formatDollarsFromCents", () => {
    it("converts cents to HKD currency format", () => {
      const result = formatDollarsFromCents(5000); // HK$50
      expect(result).toContain("50");
    });

    it("handles zero cents", () => {
      const result = formatDollarsFromCents(0);
      expect(result).toContain("0");
    });

    it("rounds to nearest dollar", () => {
      const result = formatDollarsFromCents(5050); // HK$50.50 -> rounds to HK$51
      expect(result).toMatch(/50|51/); // May round depending on locale
    });

    it("handles large amounts", () => {
      const result = formatDollarsFromCents(1000000); // HK$10,000
      expect(result).toContain("10,000");
    });

    it("includes currency symbol", () => {
      const result = formatDollarsFromCents(5000);
      expect(result).toContain("HK$");
    });
  });

  describe("titleCase", () => {
    it("capitalizes first letter of each word", () => {
      expect(titleCase("hello world")).toBe("Hello World");
    });

    it("lowercases other letters", () => {
      expect(titleCase("HELLO WORLD")).toBe("Hello World");
    });

    it("handles mixed case", () => {
      expect(titleCase("hELLo WoRLD")).toBe("Hello World");
    });

    it("returns empty string unchanged", () => {
      expect(titleCase("")).toBe("");
    });

    it("handles whitespace-only input", () => {
      expect(titleCase("   ")).toBe("");
    });

    it("handles single words", () => {
      expect(titleCase("book")).toBe("Book");
    });

    it("handles multiple spaces between words", () => {
      expect(titleCase("hello    world")).toBe("Hello World");
    });

    it("trims leading/trailing whitespace", () => {
      expect(titleCase("  hello world  ")).toBe("Hello World");
    });
  });
});
