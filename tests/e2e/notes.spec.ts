import { test, expect } from "@playwright/test";

test.describe("Notes", () => {
  test("create note and verify it appears in library", async ({ page }) => {
    const email = `note-${Date.now()}@example.com`;

    // Register
    await page.goto("/register");
    await page.fill('[name="name"]', "Note User");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/library/);

    // Go to new note
    await page.goto("/new-note");
    await expect(page.locator("text=Start a new piece")).toBeVisible();

    // Click Knowledge category
    await page.click("text=Knowledge");
    await page.waitForURL(/\/editor\//);

    // Type in editor
    await page.fill('[placeholder="Title"]', "My Test Note");
    await page.locator(".ProseMirror").fill("This is the body of my test note");
    await page.waitForTimeout(1500); // wait for autosave

    // Go to library
    await page.goto("/library");
    await expect(page.locator("text=My Test Note")).toBeVisible();
  });
});
