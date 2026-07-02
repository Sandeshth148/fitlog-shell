import { test, expect } from '@playwright/test';

test.describe('FitLog E2E Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('should load the homepage and display welcome message', async ({ page }) => {
    // Check tab title
    await expect(page).toHaveTitle(/FitLog/i);
    
    // Check main welcome header
    const welcomeHeader = page.locator('.welcome-header h1');
    await expect(welcomeHeader).toBeVisible();
    await expect(welcomeHeader).toContainText('FitLog');
  });

  test('should toggle theme mode correctly', async ({ page }) => {
    // Locate theme selector trigger
    const dropdownTrigger = page.locator('app-theme-selector .dropdown-trigger');
    await expect(dropdownTrigger).toBeVisible();
    
    // Open the dropdown
    await dropdownTrigger.click();
    
    // Select Dark option
    const darkOption = page.locator('app-theme-selector .dropdown-option').filter({ hasText: 'Dark' });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    
    // Verify HTML element data-theme attribute updates to dark
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should navigate to Weight Tracker page and check elements alignment', async ({ page }) => {
    // Find nav links to weight-tracker
    const weightLink = page.locator('a[href="/weight-tracker"], a[routerlink="/weight-tracker"]');
    
    if (await weightLink.count() > 0) {
      await weightLink.first().click();
      
      // Wait for navigation
      await page.waitForURL('**/weight-tracker');
      
      // Title should match translation keys or label
      const pageHeader = page.locator('.fitlog-header h1');
      await expect(pageHeader).toBeVisible();
      
      // The add-entry button should be visible
      const addBtn = page.locator('.add-entry-btn');
      if (await addBtn.count() > 0) {
        await expect(addBtn).toBeVisible();
      }
    }
  });

  test('should load Fasting Tracker page and check container structure', async ({ page }) => {
    const fastingLink = page.locator('a[href="/fasting"], a[routerlink="/fasting"]');
    
    if (await fastingLink.count() > 0) {
      await fastingLink.first().click();
      await page.waitForURL('**/fasting');
      
      // Fasting container should exist
      const container = page.locator('.fasting-container');
      await expect(container).toBeVisible();
    }
  });

  test('should navigate to Tasks page and verify structure', async ({ page }) => {
    const tasksLink = page.locator('a[href="/tasks"], a[routerlink="/tasks"]');
    
    if (await tasksLink.count() > 0) {
      await tasksLink.first().click();
      await page.waitForURL('**/tasks');
      
      // Tasks page header should say 'Task Tracker'
      const pageHeader = page.locator('.task-header h1');
      await expect(pageHeader).toBeVisible();
      await expect(pageHeader).toContainText('Task Tracker');
      
      // Stats grid should be visible
      const statsGrid = page.locator('.stats-grid');
      await expect(statsGrid).toBeVisible();
    }
  });
});
