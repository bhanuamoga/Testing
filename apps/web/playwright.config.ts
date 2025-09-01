// import { defineConfig } from "@playwright/test";

// export default defineConfig({
//   testDir: "./e2e",
//   use: {
//     baseURL: "http://localhost:3000", // Change if needed
//     headless: true,
//     trace: "on",
//   },
// });

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000", // Change if needed
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [
    ["list"], // shows results in CI logs
    ["html", { outputFolder: "playwright-report", open: "never" }], // saves HTML report
  ],
});
