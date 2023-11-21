const classUrls = require('../fixtures/urls.js');
const classData = require('../fixtures/data.js');
const helper    = require('../support/helpers.js');
const util = require("util");

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



    _loadDynamicData(value, endPoint) {
        const keyName = value.replace(/#/g, "");
        if (['SECURE_URL', 'BASE_URL'].includes(keyName)) {
            let path = this.URL[endPoint].split('/v2/')[1];
            return `${this.URL[keyName.replace('_URL', '').toLowerCase()]}/v2/${path}`;
        }
        switch (keyName) {
            case 'TOKEN_ID'         :
                return this.tokens.body.id;
            case 'TOKEN_YAPE_ID'    :
                return this.tokens_yape.body.id;
            case 'CHARGE_ID'        :
                return this.charges.body.id;
            case 'REFUND_ID'        :
                return this.refunds.body.id;
            case 'ORDER_ID'         :
                return this.orders.body.id;
            case 'ORDER_NUMBER'     :
                return `#id-${String(Math.floor(Math.random() * 1000000000000)).padStart(12, '0')}`;
            case 'CUSTOMER_ID'      :
                return this.customers.body.id;
            case 'CARD_ID'          :
                return this.cards.body.id;
            case 'PLAN_ID'          :
                return this.plans.body.id;
            case 'EMAIL_TEMP'       :
                return this.email;
            case 'DATE_AFTER_TODAY' :
                return this._getNumberDate(1);
            case 'DATE_BEFORE_TODAY':
                return this._getNumberDate(-1);
            case 'DATE_CURRENT'     :
                return this._getNumberDate(0);
            case 'ID_AFTER_AUTOGEN' :
                return this[`${endPoint}`].body.paging.cursors.after;
            case 'ID_BEFORE_AUTOGEN':
                return this[`${endPoint}`].body.paging.cursors.before;
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
            endPoint         = this._validateEndPoint(endPoint);
            let response     = this[endPoint].body;
            if (!response.hasOwnProperty("data")) {
                 cy.logManager('RESPONSE', response, 'response');
            } else {
                let responseData = {};
                responseData[`firstRecord`] = response.data[0] || {};
                 cy.logManager('RESPONSE', responseData, 'response');
            }
        }
    }

    _validateResponse(endPoint, field, conditional, value) {
        value                = helper.isDynamic(value) ? helper.extractAndSetDynamicValue(value, endPoint, this) : value;
        const chaiAssertion  = this.constants.CONDITIONALS_MAP[conditional] || null;
        cy.log(helper.assertionMap);
        if(!helper.assertionMap().hasOwnProperty(chaiAssertion))
            throw new Error(`Unknown assertion "${chaiAssertion}". Add assertion in data.js file`);

/*
        const isValidInteger = (str) => /^\+?(0|[1-9]\d*)$/.test(str);
        let path             = field.split(/\[(.*?)\]|\.+/).filter(Boolean);
        let responseValue    = path.reduce((obj, segment) => {
            if (Array.isArray(obj) && isValidInteger(segment)) {
                const index = parseInt(segment);
                if (index >= obj.length) {
                    throw new Error(`Array index "${index}" out of range in response.`);
                }
                return obj[index];
            } else if (!obj.hasOwnProperty(segment)) {
                throw new Error(`The field "${segment}" does not exist in response.`);
            }
            return obj[segment];
        }, this[endPoint]);


        let normalizedResponseValue = (responseValue !== null) ? responseValue.toString().normalize().replace(/\s+/g, ' ').trim() : responseValue;
        let normalizedValue         = value.toString().normalize().replace(/\s+/g, ' ').trim();

        if (helper.assertionMap.hasOwnProperty(chaiAssertion)) {
            assertionMap[chaiAssertion]();
        } else if (['number', 'string', 'boolean'].includes(typeof responseValue)) {
            expect(normalizedResponseValue).to[chaiAssertion](normalizedValue);
        } else {
            expect(responseValue).to[chaiAssertion](value);
        }
        let result = responseValue && responseValue.hasOwnProperty('data') ? responseValue.data[0] : responseValue;
        cy.logManager('ASSERTION', {result, value}, 'assertion');

 */
    }


}