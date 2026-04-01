const util = require('util');

const HASH_REGEX = /#([a-zA-Z0-9_]+)#/g;

const isDynamic = value => /#([a-zA-Z0-9_]+)#/.test(value);

const isUniqueDynamic = value =>
    typeof value === 'string' &&
    value.startsWith('#') &&
    value.endsWith('#') &&
    value.split('#').length - 1 === 2;

const extractAndSetDynamicValue = (text, endPoint, _self) => {
    const isPhrase      = str => str.startsWith('#') && str.endsWith('#');
    const dynamicValues = (text.match(HASH_REGEX) || []).map(value =>
        _self._loadDynamicData(value, endPoint)
    );
    const replaced = text.replace(HASH_REGEX, '%s');
    return isPhrase(text)
        ? dynamicValues[0]
        : util.format(replaced, ...dynamicValues);
};

const assertionE2E = (elementType, element, assertion, value) => {
    const expectFn = {
        'have.text' : (el, text) => el.should(assertion, text),
        'be.visible': el => el.should(assertion),
        'url.eq'    : (el, url) => el.should('eq', url),
    };
    return expectFn[assertion](element, value);
};

const assertionMap = (responseValue, value, assertion, endPoint, field, _self) => {
    const expectFn = {
        'equal'               : (responseValue, value) => expect(responseValue).to.equal(value),
        'not.equal'           : () => expect(responseValue).to.not.equal(value),
        'deep.equal'          : () => expect(JSON.stringify(responseValue)).to.deep.equal(JSON.parse(value)),
        'not.deep.equal'      : () => expect(responseValue).to.not.deep.equal(value),
        'not.include'         : () => expect(responseValue).to.not.include(value),
        'match'               : () => expect(responseValue).to.match(value),
        'not.match'           : () => expect(responseValue).to.not.match(value),
        'string'              : () => expect(responseValue).to.be.a('string'),
        'number'              : () => expect(responseValue).to.be.a('number'),
        'boolean'             : () => expect(responseValue).to.be.a('boolean'),
        'array'               : () => expect(responseValue).to.be.a('array'),
        'object'              : () => expect(responseValue).to.be.a('object'),
        'null'                : () => expect(responseValue).to.be.null,
        'not.null'            : () => expect(responseValue).to.not.be.null,
        'undefined'           : () => expect(responseValue).to.be.undefined,
        'not.undefined'       : () => expect(responseValue).to.not.be.undefined,
        'empty'               : () => expect(responseValue).to.be.empty,
        'not.empty'           : () => expect(responseValue).to.not.be.empty,
        'true'                : () => expect(responseValue).to.be.true,
        'false'               : () => expect(responseValue).to.be.false,
        'exist'               : () => expect(responseValue).to.exist,
        'startsWith'          : () => expect(responseValue.startsWith(value)).to.be.true,
        'not.instanceof'      : () => expect(responseValue).to.not.be.an.instanceof(value),
        'instanceof'          : () => expect(responseValue).to.be.an.instanceof(value),
        'have.property'       : () => expect(_self[endPoint]).to.have.own.property(field),
        'have.nested.property': () => expect(_self[endPoint]).to.have.nested.property(field),
        'above'               : () => expect(responseValue).to.above(Number(value)),
        'below'               : () => expect(responseValue).to.below(Number(value)),
        'most'                : () => expect(responseValue).to.most(Number(value)),
        'least'               : () => expect(responseValue).to.least(Number(value)),
        'have.property.index' : () => expect(responseValue[0]).to.have.nested.property(value),
        'equal.length'        : () => expect(responseValue.length).to.equal(JSON.parse(value)),
        'above.length'        : () => expect(responseValue.length).to.above(JSON.parse(value)),
        'below.length'        : () => expect(responseValue.length).to.below(JSON.parse(value))
    };
    return expectFn[assertion](responseValue, value);
}

const isValidInteger = str => /^\+?(0|[1-9]\d*)$/.test(str);

const convertFieldToArray = field => field.split(/\[(.*?)\]|\.+/).filter(Boolean);

const getChaiAssertion = (assertMap, conditional) => {
    const assertion = assertMap[conditional];
    if (!assertion) {
        throw new Error(`Conditional '${conditional}' not found`);
    }
    return assertion;
};

const getNestedPropertyValue = (object, path) =>
    path.reduce((obj, segment) => {
        if (Array.isArray(obj)) {
            const index = parseInt(segment, 10);
            if (isNaN(index) || index >= obj.length) {
                throw new Error(`Array index "${segment}" is invalid or out of range in the response.`);
            }
            return obj[index];
        }
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, segment)) {
            throw new Error(`The field "${segment}" does not exist in the response.`);
        }
        return obj[segment];
    }, object);

const normalizeValue = value => {
    if (isValidInteger(value)) return Number(value);
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const lowerCaseValue = value.trim().toLowerCase();
        return ['true', 'false'].includes(lowerCaseValue)
            ? lowerCaseValue === 'true'
            : value.trim();
    }
    if (typeof value === 'boolean') return value;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(element => normalizeValue(element));
    if (typeof value === 'object') {
        return Object.keys(value).reduce((normalizedObj, key) => {
            normalizedObj[key] = normalizeValue(value[key]);
            return normalizedObj;
        }, {});
    }
    throw new Error(`Unable to normalize value of type: ${typeof value}`);
};

const getNumberDate = days => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return Math.floor(date / 1000);
};

module.exports = {
    isDynamic,
    isUniqueDynamic,
    extractAndSetDynamicValue,
    assertionMap,
    isValidInteger,
    convertFieldToArray,
    getChaiAssertion,
    getNestedPropertyValue,
    normalizeValue,
    getNumberDate,
    assertionE2E
};

