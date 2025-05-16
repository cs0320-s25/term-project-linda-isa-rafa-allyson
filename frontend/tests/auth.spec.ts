import { test, expect } from "@playwright/test";

// Declare Clerk types
declare global {
  interface Window {
    Clerk: {
      isReady: () => Promise<boolean>;
      load: () => Promise<void>;
      mountSignIn: () => Promise<void>;
      mountSignUp: () => Promise<void>;
      signOut: () => Promise<void>;
      isSignedIn: () => boolean;
      session: {
        id: string;
        userId: string;
        getToken: () => Promise<string>;
      };
      user: {
        id: string;
        firstName: string;
        lastName: string;
        emailAddresses: Array<{ emailAddress: string }>;
        imageUrl: string;
        hasImage: boolean;
        createdAt: string;
        updatedAt: string;
      };
    };
  }
}

// Mock Clerk before each test
test.beforeEach(async ({ page, context }) => {
  // Mock Clerk's initialization
  await page.addInitScript(() => {
    // Mock the Clerk object
    window.Clerk = {
      isReady: () => Promise.resolve(true),
      load: () => Promise.resolve(),
      mountSignIn: () => Promise.resolve(),
      mountSignUp: () => Promise.resolve(),
      signOut: () => Promise.resolve(),
      isSignedIn: () => true,
      session: {
        id: 'mock-session-id',
        userId: 'test-user-123',
        getToken: () => Promise.resolve('mock-token'),
      },
      user: {
        id: 'test-user-123',
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        imageUrl: 'https://example.com/avatar.jpg',
        hasImage: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  });

  // Mock all Clerk-related cookies
  await context.addCookies([
    {
      name: "clerk-db-jwt",
      value: "mock-jwt-token",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
    },
    {
      name: "__session",
      value: "mock-session-token",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
    },
    {
      name: "uid",
      value: "test-user-123",
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
    }
  ]);

  // Mock the Clerk user state
  await page.addInitScript(() => {
    window.localStorage.setItem('clerk.user', JSON.stringify({
      id: 'test-user-123',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      imageUrl: 'https://example.com/avatar.jpg',
      hasImage: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  });

  // Mock fetch for Clerk API calls
  await page.route('**/api/clerk/**', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 'test-user-123',
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      }),
    });
  });

  await page.goto("http://localhost:3000/");
});

test("should display the homepage without login UI", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Welcome to MoodTunes" })).toBeVisible();
});

test("should display the sign in button", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("the user signs in", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Welcome to MoodTunes" })).toBeVisible();
  await page.getByRole("button", { name: "Sign In to Get Started" }).click();
  await expect(page.getByRole("button", { name: "Generate Playlist" })).toBeVisible();

  await page.getByRole("textbox", { name: "How are you feeling?" }).fill("happy");
  await page.getByRole("textbox", { name: "Share a memory (optional)" }).fill("Walking through the park");
  await page.getByRole("button", { name: "Generate Playlist" }).click();

  await expect(page.getByRole("heading", { name: "Your Generated Playlist" })).toBeVisible();
});

test('if the user chooses an emotion, songs are generated', async ({page}) => {
  await page.getByRole('button', { name: 'Sign In to Get Started' }).click();
  await page.getByRole('button', { name: 'Generate Playlist' }).click();
  await expect(page.getByRole('heading', { name: 'Generate Your Playlist' })).toBeVisible();
  await page.getByRole('textbox', { name: 'How are you feeling?' }).click();
  await page.getByRole('textbox', { name: 'How are you feeling?' }).fill('happy');
  await page.getByRole('textbox', { name: 'Share a memory (optional)' }).click();
  await page.getByRole('textbox', { name: 'Share a memory (optional)' }).fill('walking through the park');
  await page.getByRole('button', { name: 'Generate Playlist' }).click();
  await expect(page.getByRole('heading', { name: 'Your Generated Playlist' })).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).first()).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(1)).toBeVisible();
  await expect(page.locator('.MuiBox-root > .MuiSvgIcon-root > path').first()).toBeVisible();
  await expect(page.locator('div:nth-child(3) > .MuiSlider-root').first()).toBeVisible();
  
});

test('if the user clicks regenerate, songs are regenerated', async ({page}) => {
  await page.getByRole('button', { name: 'Sign In to Get Started' }).click();
  await page.getByRole('button', { name: 'Generate Playlist' }).click();
  await expect(page.getByRole('heading', { name: 'Generate Your Playlist' })).toBeVisible();
  await page.getByRole('textbox', { name: 'How are you feeling?' }).click();
  await page.getByRole('textbox', { name: 'How are you feeling?' }).fill('happy');
  await page.getByRole('textbox', { name: 'Share a memory (optional)' }).click();
  await page.getByRole('textbox', { name: 'Share a memory (optional)' }).fill('walking through the park');
  await page.getByRole('button', { name: 'Generate Playlist' }).click();
  await expect(page.getByRole('heading', { name: 'Your Generated Playlist' })).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).first()).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Regenerate' }).click();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).first()).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(1)).toBeVisible();
  await expect(page.locator('.MuiBox-root > .MuiSvgIcon-root > path').first()).toBeVisible();
  await expect(page.locator('div:nth-child(3) > .MuiSlider-root').first()).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ }).first()).toBeVisible();  
});