const {attach}  = require("@badeball/cypress-cucumber-preprocessor");
const classUrls = require('../fixtures/urls.js');
const classData = require('../fixtures/data.js');

const arEnv = Cypress.env('environment').split('-');
let urls    = classUrls(arEnv);
let data    = classData(arEnv);

module.exports = class Main {
    constructor() {
        this.urls      = urls.getAllUrls();
        this.data      = data.getData();
        this.constants = data.constants();
        this.request   = {};
        this.response  = {};
    }

    _validateMethod(method) {
        method = method.toUpperCase();
        if (!this.constants.METHODS_LIST.includes(method)) throw new Error('Invalid method http request: ' + method);
        return method;
    }

    _validateEndPoint(endPoint) {
        endPoint = endPoint.toLowerCase();
        if (!this.constants.SERVICES_LIST.includes(endPoint)) throw new Error('Invalid service endpoint: ' + endPoint);
        return endPoint;
    }

    _setRequest(endPoint, options) {
        return cy.request(options).then(resp => {
            this[endPoint.toLowerCase()] = resp;
        });
    }

    _showManager(type, endPoint) {
        if (!['response', 'request'].includes(type)) {
            throw new Error(`Unknown ${type} type`);
        }
        if (type === 'request') {
            this._logManager('REQUEST', this.request[endPoint], 'request');
        } else {
            endPoint         = this._validateEndPoint(endPoint);
            let response     = this[endPoint].body;
            let responseData = {};
            if (!response.hasOwnProperty("data")) {
                this._logManager('RESPONSE', response, 'response');
            } else {
                responseData[`firstRecord`] = response.data[0] || {};
                this._logManager('RESPONSE', responseData, 'response');
            }
        }
    }

    _logManager(title, content, type) {
        let logCypress, logReports;
        if (type === 'assertion') {
            logCypress = `🔎${title}: \n✅Response value: (${JSON.stringify(content.result)})\n⬆️Expected value: (${content.value})`;
            logReports = `${title}: \n✅Response value: \n${JSON.stringify(content.result, null, 4)} \n⬆️Expected value: \n${content.value}`;
        } else {
            logCypress = `🔎${title}: ${JSON.stringify(content)}`;
            logReports = `${title}: \n ${JSON.stringify(content, null, 4)}`;
        }
        cy.log(logCypress);
        attach(logReports, null);
    }


}