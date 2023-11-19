const {defineConfig}                  = require("cypress");
const setupNodeEvents                = require("./cypress/support/setupNodeEvents");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents,
        specPattern      : "cypress/e2e/**/*.feature",
        chromeWebSecurity: false,
        env              : {
            "environment": "qa-test"
        }
    },
});
