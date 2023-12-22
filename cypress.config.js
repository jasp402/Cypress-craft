const {defineConfig}  = require("cypress");
const setupNodeEvents = require("./cypress/settings/setupNodeEvents");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents,
        specPattern      : "cypress/**/*.feature",
        chromeWebSecurity: false,
        env              : {
            "environment": "prod"
        }
    },
});
