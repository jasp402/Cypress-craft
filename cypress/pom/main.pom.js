const classUrls = require('../fixtures/urls.js');
const classData = require('../fixtures/data.js');

const arEnv = Cypress.env('environment').split('-');
let urls    = classUrls(arEnv);
let data    = classData(arEnv);

module.exports = class Main {
    constructor() {
        this.urls = urls.getAllUrls();
        this.data = data.getData();
        this.constants = data.constants();
    }

    _getTestData() {
        cy.log(JSON.stringify(this.data));
    }

    _validateMethod(method) {
        method = method.toUpperCase();
        if (!data.constants.METHODS_LIST.includes(method)) throw new Error('Invalid method http request: ' + method);
        return method;
    }

}