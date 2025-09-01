
import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {

  // 🔹 1. UI Rendering Tests
  
  test("should render all UI elements", async ({ page }) => {
    await page.goto("http://localhost:3000/sign-in");

    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible(); // login  => Login  or LOGIN or lOGIN
    await expect(page.getByText("Enter your email and password below")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(page.getByText("Password", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    await expect(page.getByText("You want create new account?")).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /facebook/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /terms of service/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Privacy Policy/i })).toBeVisible();

    await page.screenshot({ path: `test-results/login-success-${Date.now()}.png`, fullPage: true });
  });

//🔹 2. Form Validation Tests

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("http://localhost:3000/sign-in");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/Please enter your email/i)).toBeVisible();
    await expect(page.getByText(/Please enter your password/i)).toBeVisible();
  });




  test("should show error for invalid email format", async ({ page }) => {
    await page.goto("http://localhost:3000/sign-in");
    await page.getByLabel("Email").fill("girish.com");
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test("should show error for wrong credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("wrong@email.com");
    await page.locator("#password").fill("wrongpassword");

    await page.getByRole("button", { name: /login/i }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test("password field should be masked by default", async ({ page }) => {
    await page.goto("/sign-in");
      const passwordInput = page.locator("#password"); // directly by ID
  await expect(passwordInput).toHaveAttribute("type", "password");
  });

//🔹 3. Functional Tests
  
test("should login successfully and redirect to role-menu", async ({ page }) => {
  await page.goto("/sign-in");

  await page.getByLabel("Email").fill("himab84261@decodewp.com");
  await page.locator('#password').fill("himab84261@decodewp.com");

  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL("http://localhost:3000/role-menu", { timeout: 10000 });
});


  // test("should navigate to forgot password page", async ({ page }) => {
  //   await page.goto("/sign-in");
  //   await page.getByText("Forgot password?").click();
  //   await expect(page).toHaveURL(/.*forgot-password/);
  // });

  test("should navigate to sign-up page", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("link", { name: /sign up/i }).click();
    await page.waitForTimeout(1000); 
    await expect(page).toHaveURL(/.*sign-up/);
    await page.screenshot({ path: `test-results/login-success.png`, fullPage: true });
  });

  // test("should open terms of service and privacy policy", async ({ page }) => {
  //   await page.goto("/sign-in");
  //   await page.getByRole("link", { name: /terms of service/i }).click();
  //   await expect(page).toHaveURL(/.*terms/);

  //   await page.goto("/sign-in");
  //   await page.getByRole("link", { name: /privacy policy/i }).click();
  //   await expect(page).toHaveURL(/.*privacy/);
  // });

  test("should allow social login buttons to be clicked", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: /github/i }).click();
    await page.getByRole("button", { name: /facebook/i }).click();
  });

//🔹 4. UX / Interaction Tests

  test("should toggle password visibility", async ({ page }) => {
  await page.goto("/sign-in");

  const passwordInput = page.getByRole("textbox", { name: "Password" });
  await passwordInput.fill("mypassword");

  await page.getByRole("button", { name: "Show password" }).click();
  await expect(passwordInput).toHaveAttribute("type", "text");
  await page.waitForTimeout(1000); 

  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(passwordInput).toHaveAttribute("type", "password");
});


  // test("login button should be disabled until fields are filled (if enforced)", async ({ page }) => {  // --- Important
  //   await page.goto("/sign-in");
  //   await expect(page.getByRole("button", { name: /login/i })).toBeDisabled();

  //   await page.getByLabel("Email").fill("user@test.com");
  //     await page.locator('#password').fill("password123");

  //   await expect(page.getByRole("button", { name: /login/i })).toBeEnabled();
  // });

  test("error messages should disappear after correction", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page.getByText(/Please enter your email/i)).toBeVisible();

    await page.getByLabel("Email").fill("user@test.com");
    await expect(page.getByText(/Please enter your email/i)).toHaveCount(0);
  });

  test("should show loading state while logging in", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("himab84261@decodewp.com");
     const passwordInput = page.getByRole("textbox", { name: "Password" });
  await passwordInput.fill("himab84261@decodewp.com");
    const loginButton = page.getByRole("button", { name: /login/i });
    await loginButton.click();

   await expect(loginButton.locator("svg.animate-spin")).toBeVisible();

  });
  


  // 🔹 5. Security / Access Tests

  test("should redirect unauthenticated user from protected page", async ({ page }) => {
    await page.goto("/role-menu");
    await expect(page).toHaveURL(/.*sign-in/);
  });


  test("should keep session active with remember me (if available)", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("himab84261@decodewp.com");
    await page.locator('#password').fill("himab84261@decodewp.com");

    if (await page.getByLabel("Remember me").isVisible()) {
      await page.getByLabel("Remember me").check();
    }

    await page.getByRole("button", { name: /login/i }).click();
    await expect(page).toHaveURL(/.*role-menu/);
   
    await page.reload();
    await expect(page).toHaveURL(/.*role-menu/);
  });
});
