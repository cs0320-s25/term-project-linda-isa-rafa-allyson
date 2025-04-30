import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");
  });

  test("should display the sign in button", async ({ page }) => {
    // Check if the sign in button is visible
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});
