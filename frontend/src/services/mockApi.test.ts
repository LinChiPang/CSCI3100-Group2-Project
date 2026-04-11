import { describe, expect, it } from "vitest";
import { login, register } from "./mockApi";

describe("mock auth domain eligibility", () => {
  it("allows registration from an approved CUHK domain", async () => {
    await expect(register("user@cse.cuhk.edu.hk", "password123", "password123", 1, "user")).resolves.toMatchObject({
      user: { email: "user@cse.cuhk.edu.hk" },
    });
  });

  it("rejects registration from an unapproved CUHK subdomain", async () => {
    await expect(register("user@mail.cse.cuhk.edu.hk", "password123", "password123", 1, "user")).rejects.toThrow(
      "Email must use an approved CUHK email domain",
    );
  });

  it("allows login from an approved CUHK domain", async () => {
    await expect(login("user@link.cuhk.edu.hk", "password123")).resolves.toMatchObject({
      user: { email: "user@link.cuhk.edu.hk" },
    });
  });

  it("rejects login from an unapproved domain", async () => {
    await expect(login("user@e.cuhk.edu.hk", "password123")).rejects.toThrow("Invalid email or password");
  });
});
