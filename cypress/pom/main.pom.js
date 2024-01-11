const {
          assertionMap,
          convertFieldToArray,
          extractAndSetDynamicValue,
          getChaiAssertion,
          getNestedPropertyValue,
          isDynamic,
          normalizeValue,
          getNumberDate,
          isUniqueDynamic,
          assertionE2E
      }         = require('../settings/helpers.js');
const classUrls = require('../fixtures/urls.js');
const classData = require('../fixtures/data.js');

const arEnv = Cypress.env('environment').split('-');
let urls    = classUrls(arEnv);
let data    = classData(arEnv);

module.exports = class Main {
    constructor(elements=null) {
        this.urls            = urls.getAllUrls();
        this.data            = data.getData();
        this.constants       = data.constants();
        this.elements        = {...elements}
        this.request         = {};
        this.response        = {};
        this.currentEndPoint = {};
    }

    _loadEndPoint(endPoint){
        this._validateEndPoint(endPoint);
        this.currentEndPoint  = endPoint;
    }

    _applyDynamicSettings(options, settings, endPoint = null) {
        const parameters       = ['url', 'headers', 'body', 'qs', 'exclude'];
        const handleAttributes = (options, settings, key, endPoint) => {
            if (isUniqueDynamic(settings[key])) {
                const value  = settings[key];
                options[key] = isDynamic(value) ? extractAndSetDynamicValue(value, endPoint, this) : value;
            } else {
                const parsedKey = JSON.parse(settings[key]);
                for (const [keyPart, value] of Object.entries(parsedKey)) {
                    options[key][keyPart] = isDynamic(value) ? extractAndSetDynamicValue(value, endPoint, this) : value;
                }
            }
        }
        const handleUrl        = (options, settings, endPoint) => {
            const urlParts = settings.url.split('/').map(part =>
                isDynamic(part) ? extractAndSetDynamicValue(part, endPoint, this) : part
            );
            options.url    = urlParts.join('/');
        }
        const handleExclude    = (options, settings) => {
            const parsedExclude = JSON.parse(settings.exclude);
            for (const deleteItem of parsedExclude) {
                delete options.body[deleteItem];
            }
        }

        parameters.forEach(key => {
            if (settings.hasOwnProperty(key)) {
                if (key === 'url') {
                    handleUrl(options, settings, endPoint);
                } else if (key === 'exclude') {
                    handleExclude(options, settings);
                } else {
                    handleAttributes(options, settings, key, endPoint);
                }
            }
        });
        return options;
    }

    _loadDynamicData(value, endPoint) {
        const keyName = value.replace(/#/g, "");
        switch (keyName) {
            case 'BASE_URL'         :
                return `${this.urls['base']}`;
            default                 :
                return this.data[keyName];
        }
    }

    _validateMethod(method) {
        method = method.toUpperCase();
        if (!this.constants.METHODS_LIST.includes(method)) throw new Error('Invalid method http request: ' + method);
        return method;
    }

    _validateEndPoint(endPoint) {
        // endPoint = endPoint.toLowerCase();
        if (!this.constants.SERVICES_LIST.includes(endPoint)) throw new Error('Invalid service endpoint: ' + endPoint);
        return endPoint;
    }

    _setRequest(endPoint, options) {
        return cy.request(options).then(resp => {
            this[endPoint] = resp;
        });
    }

    _showManager(type, endPoint) {
        if (!['response', 'request', 'petición', 'respuesta'].includes(type)) {
            throw new Error(`Unknown ${type} type`);
        }
        if (type === 'request') {
            cy.logManager('REQUEST', this.request[endPoint], 'request');
        } else {
            endPoint     = this._validateEndPoint(endPoint);
            let response = this[endPoint].body;
            cy.logManager('RESPONSE', response, 'response');
        }
    }

    _validateResponse(endPoint, field, conditional, value) {
        const expectedValue = isDynamic(value) ? extractAndSetDynamicValue(value, endPoint, this) : value;
        const chaiAssertion = getChaiAssertion(this.constants.CONDITIONALS_MAP, conditional);
        const path          = convertFieldToArray(field);
        const responseValue = getNestedPropertyValue(this[endPoint], path);

        const normalizedValue         = normalizeValue(expectedValue);
        const normalizedResponseValue = normalizeValue(responseValue);
        assertionMap(normalizedResponseValue, normalizedValue, chaiAssertion, endPoint, field, this);

        let result = responseValue && responseValue.hasOwnProperty('data') ? responseValue.data[0] : responseValue;
        cy.logManager('ASSERTION', {result, value}, 'assertion');
        return responseValue;
    }


    // Functions E2E
    _open(endPoint = null) {
        cy.visit(String(this.urls[endPoint] || this.urls.base));
    }

    _getElement(elementId) {
        return this.elements[elementId]();
    }

    _validate(elementType, elementId, condition, content=null){
        const endPoint = this.currentEndPoint;
        const element  = this._getElement(elementId);
        const expectedValue = content ? (isDynamic(content) ? extractAndSetDynamicValue(content, endPoint, this) : content) : null;
        const chaiAssertion = getChaiAssertion(this.constants.CONDITIONALS_MAP_E2E, condition);


        assertionE2E(elementType, element, chaiAssertion, expectedValue, endPoint, this);
        cy.logManagerE2E('ASSERTION', {result:elementId, condition, value:expectedValue}, 'assertion');
    }
}