const { preprocessor } = require("@badeball/cypress-cucumber-preprocessor/browserify");
const {addCucumberPreprocessorPlugin} = require("@badeball/cypress-cucumber-preprocessor");

const setupNodeEvents = async (on, config) => {
    await addCucumberPreprocessorPlugin(on, config);
    on("file:preprocessor", preprocessor(config));
    return config;
};

module.exports = setupNodeEvents