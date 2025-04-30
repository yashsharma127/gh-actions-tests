import { chromium, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.TARGET_VM_URL || "http://localhost:3000" || "http://localhost";
const authFile = path.join(__dirname, "auth.json");

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);
  await page.getByLabel("Email").fill("admin@techsonic.com");
  await page.getByLabel("Password").fill("123456789");
  await page.getByRole("button", { name: "Login", exact: true }).click();

  // Wait for login success
  await expect(page.getByText("Login Successfull")).toBeVisible();
  await page.waitForTimeout(5000);
  
  await page.waitForURL(/equipment/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;
