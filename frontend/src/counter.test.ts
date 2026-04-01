import { describe, expect, it, beforeEach, vi } from "vitest";
import { setupCounter } from "./counter";

describe("setupCounter", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    button = document.createElement("button");
  });

  it("initializes counter to 0", () => {
    setupCounter(button);
    expect(button.innerHTML).toBe("Count is 0");
  });

  it("increments counter on click", () => {
    setupCounter(button);
    button.click();
    expect(button.innerHTML).toBe("Count is 1");
  });

  it("increments counter multiple times", () => {
    setupCounter(button);
    button.click();
    button.click();
    button.click();
    expect(button.innerHTML).toBe("Count is 3");
  });
});
