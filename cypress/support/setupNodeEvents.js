const { preprocessor } = require("@badeball/cypress-cucumber-preprocessor/browserify");
const {addCucumberPreprocessorPlugin} = require("@badeball/cypress-cucumber-preprocessor");

const setupNodeEvents = async (on, config) => {
    on("file:preprocessor", preprocessor(config));
    await addCucumberPreprocessorPlugin(on, config);
    return config;
};

module.exports = setupNodeEvents