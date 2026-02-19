const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000/ynov-tdd-validator",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
