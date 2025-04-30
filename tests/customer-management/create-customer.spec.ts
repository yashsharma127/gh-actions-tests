import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();
const baseURL = process.env.TARGET_VM_URL || "http://localhost:3000" || "http://localhost";

test.describe("Customer Management", () => {
    test.beforeEach(async ({ page }) => {
        const maxRetries = 2; 
        let attempt = 0;
    
        while (attempt <= maxRetries) {
        try {
            await page.goto(`${baseURL}/customers`, { timeout: 30_000, waitUntil: "networkidle" });

            await page.waitForSelector('table tbody tr', { timeout: 10_000 });
            
            console.log(`✅ Page loaded successfully on attempt ${attempt + 1}`);
            return; 
        } catch (error) {
            console.warn(`⚠️ Page load attempt ${attempt + 1} failed, retrying...`);
            attempt++;
    
            if (attempt > maxRetries) {
            throw new Error("❌ Page failed to load after multiple attempts!");
            }
    
            await page.reload({ waitUntil: "networkidle" });
        }
        }
    });

  test("Open Process Unit Form", async ({ page }) => {
        // create customer button
        const createCustomerButton = page.locator('button[name="Create Customer"]');
        await expect(createCustomerButton).toBeVisible({ timeout: 15_000 });
        await expect(createCustomerButton).toBeEnabled();
        await createCustomerButton.click();
        console.log('✅ Create Customer button is visible, enabled, and clickable!');
  
        // create customer form
        const customerForm = page.locator('div[role="dialog"][title="Add Customer"]')
        await expect(customerForm).toBeVisible({ timeout: 10_000 });
        console.log("✅ Create Customer form appeared successfully!");
  
        // Fill in the Customer's Legal Name
        await page.locator('input[name="legal_name"]').fill('Test Legal Name');
        console.log("✅ Customer's Legal Name filled successfully!");
        
  //   console.log("✅ Create Unit button clicked successfully");
  });
});
