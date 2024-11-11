import { test, expect } from "@playwright/test";

test("the index page of the application contains the app's name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("2020 Suicide Rate Map Explorer");
});