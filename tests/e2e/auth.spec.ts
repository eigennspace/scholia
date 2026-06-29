import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("register with valid credentials redirects to dashboard", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/library/);
    await expect(page.locator("text=The Reading Room")).toBeVisible();
  });

  test("register with existing email shows error", async ({ page }) => {
    const email = `dup-${Date.now()}@example.com`;
    // First registration
    await page.goto("/register");
    await page.fill('[name="name"]', "User 1");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/library/);

    // Logout — navigate to login to trigger session clear
    await page.goto("/login");

    // Second registration with same email
    await page.goto("/register");
    await page.fill('[name="name"]', "User 2");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Email already in use")).toBeVisible();
  });

  test("login with valid credentials", async ({ page }) => {
    const email = `login-${Date.now()}@example.com`;
    // Register first
    await page.goto("/register");
    await page.fill('[name="name"]', "Login User");
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/library/);

    // Logout
    await page.goto("/login");

    // Login
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/library/);
    await expect(page.locator("text=The Reading Room")).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "nonexistent@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });
});
