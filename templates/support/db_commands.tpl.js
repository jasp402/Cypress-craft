/**
 * Comando personalizado para interactuar con la base de datos a través de una tarea de Cypress.
 *
 * @example
 * cy.queryDb("SELECT * FROM users WHERE id = 1").then(result => {
 *   expect(result[0].name).to.equal('John Doe');
 * });
 */
Cypress.Commands.add('queryDb', (query) => {
  cy.task('queryDb', query);
});