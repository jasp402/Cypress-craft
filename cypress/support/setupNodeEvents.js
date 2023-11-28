const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

const setupNodeEvents = async(on, config) => {
    await addCucumberPreprocessorPlugin(on, config);
    on("file:preprocessor", createBundler({plugins: [createEsbuildPlugin(config)]}));
    return config;
}

module.exports = setupNodeEvents







