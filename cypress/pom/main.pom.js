const {
          assertionMap,
          convertFieldToArray,
          extractAndSetDynamicValue,
          getChaiAssertion,
          getNestedPropertyValue,
          isDynamic,
          normalizeValue,
          getNumberDate
      }         = require('../support/helpers.js');
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



    _applyDynamicSettings(options, settings, endPoint = null) {
        const parameters       = ['url', 'headers', 'body', 'qs', 'exclude'];
        const handleAttributes = (options, settings, key, endPoint) => {
            const parsedKey = JSON.parse(settings[key]);
            for (const [keyPart, value] of Object.entries(parsedKey)) {
                options[key][keyPart] = isDynamic(value) ? extractAndSetDynamicValue(value, endPoint) : value;
            }
        }
        const handleUrl        = (options, settings, endPoint) => {
            const urlParts = settings.url.split('/').map(part =>
                isDynamic(part) ? extractAndSetDynamicValue(part, endPoint) : part
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
        const keyName       = value.replace(/#/g, "");
        const dateKeyToArg  = {
            'DATE_AFTER_TODAY' : 1,
            'DATE_BEFORE_TODAY': -1,
            'DATE_CURRENT'     : 0
        };

        let endPointId      = endPoint ? `${keyName.replace('_ID', 's').toLowerCase()}` : null;
        if (endPointId) {
            return this[endPoint].body.id;
        } else if (['SECURE_URL', 'BASE_URL'].includes(keyName)) {
            let path = this.urls[endPoint].split('/v2/')[1];
            return `${this.urls[keyName.replace('_URL', '').toLowerCase()]}/v2/${path}`;
        } else if (dateKeyToArg.hasOwnProperty(keyName)) {
            return getNumberDate(dateKeyToArg[keyName]);
        } else if (value === "ORDER_NUMBER") {
            return `#id-${String(Math.floor(Math.random() * 1000000000000)).padStart(12, '0')}`;
        } else {
            return this.data[keyName];
        }
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
            cy.logManager('REQUEST', this.request[endPoint], 'request');
        } else {
            endPoint     = this._validateEndPoint(endPoint);
            let response = this[endPoint].body;
            if (!response.hasOwnProperty("data")) {
                cy.logManager('RESPONSE', response, 'response');
            } else {
                let responseData            = {};
                responseData[`firstRecord`] = response.data[0] || {};
                cy.logManager('RESPONSE', responseData, 'response');
            }
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

}