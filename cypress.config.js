const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});
