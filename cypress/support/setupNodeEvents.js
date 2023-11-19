const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");
const {addCucumberPreprocessorPlugin} = require("@badeball/cypress-cucumber-preprocessor");
const setupNodeEvents = async (on, config) => {
    on("file:preprocessor", browserify.default(config));
    await addCucumberPreprocessorPlugin(on, config);
    return config;
};

module.exports = setupNodeEvents