// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const {attach} = require("@badeball/cypress-cucumber-preprocessor");

Cypress.Commands.add('logManager', (title, content, type) => {
    const formatContent = (data, isReport) => isReport ? JSON.stringify(data, null, 4): JSON.stringify(data);
    const createLogMessage = (title, content, isAssertion, isReport) => {
        return isAssertion
            ? `🔎${title}: \n✅Response value: \n${formatContent(content.result, isReport)}\n⬆️Expected value: \n${content.value}`
            : `🔎${title}: \n${formatContent(content, isReport)}`;
    };
    const logCypress = createLogMessage(title, content, type === 'assertion', false);
    const logReports = createLogMessage(title, content, false, true);
    cy.log(logCypress);
    attach(logReports, null);
});

Cypress.Commands.add('logManagerE2E', (title, content, type) => {
    const formatContent = (data, isReport) => isReport ? JSON.stringify(data, null, 4): JSON.stringify(data);
    const createLogMessage = (title, content, isAssertion, isReport) => {
        return isAssertion
            ? `🔎 ${title}: \n✅Element: ${content.result} | ⬆️ ${content.condition}` + (content.value ? ` | ➡️ ${content.value}` : '')
            : `🔎 ${title}: \n${formatContent(content, isReport)}`;
    };
    const logCypress = createLogMessage(title, content, type === 'assertion', false);
    const logReports = createLogMessage(title, content, false, true);
    cy.log(logCypress);
    attach(logReports, null);
});

