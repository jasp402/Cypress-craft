// cypress/settings/setupNodeEvents.tpl.js
// Este archivo es un template que será procesado por Cypress-Craft.

const createBundler = require("@cypress/webpack-preprocessor");
const webpackOptions = require("../../webpack.config").webpackOptions;

module.exports = (on, config) => {
  // Configuración del preprocesador para Cucumber
  on("file:preprocessor", createBundler(webpackOptions(config)));

  // @INJECT_DB_TASKS_HERE
  
  // Asegúrate de retornar el objeto de configuración modificado.
  return config;
};