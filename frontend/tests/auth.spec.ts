import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    {
      name: "uid",
      value: "test-user-123",
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
    },
  ]);

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

test('if the user clicks regenerate, songs are regenerated', async ({ page }) => {
  await page.getByRole('button', { name: 'Sign In to Get Started' }).click();
  await page.getByRole('button', { name: 'Generate Playlist' }).click();

  await page.getByRole('textbox', { name: 'How are you feeling?' }).click();
  await page.getByRole('textbox', { name: 'How are you feeling?' }).fill('happy');
  await page.getByRole('textbox', { name: 'Share a memory (optional)' }).click();
  await page.getByRole('textbox', { name: 'Share a memory (optional)' }).fill('walking through the park');
  await page.getByRole('button', { name: 'Generate Playlist' }).click();

  await expect(page.getByRole('heading', { name: 'Your Generated Playlist' })).toBeVisible();

  const firstSongs = await page.evaluate(() => {
    const songElements = Array.from(document.querySelectorAll('.MuiTypography-h6'));
    return songElements.map(element => element.textContent);
  });
  console.log('First set of songs:', firstSongs);

  // Click regenerate
  await page.getByRole('button', { name: 'Regenerate' }).click();
  await page.waitForTimeout(1000);

  const secondSongs = await page.evaluate(() => {
    const songElements = Array.from(document.querySelectorAll('.MuiTypography-h6'));
    return songElements.map(element => element.textContent);
  });
  console.log('Second set of songs:', secondSongs);
  
  // Assert the songs are different
  expect(secondSongs).not.toEqual(firstSongs);
});
