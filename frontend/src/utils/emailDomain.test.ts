import { describe, expect, it } from "vitest";
import { isAllowedCuhkEmailDomain } from "./emailDomain";

describe("isAllowedCuhkEmailDomain", () => {
  it("accepts approved exact CUHK domains", () => {
    expect(isAllowedCuhkEmailDomain("user@cuhk.edu.hk")).toBe(true);
    expect(isAllowedCuhkEmailDomain("user@link.cuhk.edu.hk")).toBe(true);
    expect(isAllowedCuhkEmailDomain("user@cse.cuhk.edu.hk")).toBe(true);
  });

  it("accepts approved CUHK domains case-insensitively", () => {
    expect(isAllowedCuhkEmailDomain("user@CUHK.EDU.HK")).toBe(true);
    expect(isAllowedCuhkEmailDomain("user@Link.CUHK.EDU.HK")).toBe(true);
  });

  it("rejects unapproved and lookalike domains", () => {
    expect(isAllowedCuhkEmailDomain("user@gmail.com")).toBe(false);
    expect(isAllowedCuhkEmailDomain("user@fakecuhk.edu.hk")).toBe(false);
    expect(isAllowedCuhkEmailDomain("user@cuhk.edu.hk.evil.com")).toBe(false);
    expect(isAllowedCuhkEmailDomain("user@mail.cse.cuhk.edu.hk")).toBe(false);
    expect(isAllowedCuhkEmailDomain("user@e.cuhk.edu.hk")).toBe(false);
  });
});
