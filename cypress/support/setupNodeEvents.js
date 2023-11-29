const webpack = require("@cypress/webpack-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const {webpackOptions} = require('./../../webpack.config');

const setupNodeEvents = async(on, config) => {
    await addCucumberPreprocessorPlugin(on, config);
    on("file:preprocessor",  webpack(webpackOptions(config)));
    return config;
}

module.exports = setupNodeEvents;