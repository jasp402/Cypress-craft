const util = require("util");

function isDynamic(value) {
    return Boolean(/#([a-zA-Z0-9_]+)#/g.test(value));
}

function isUniqueDynamic(value) {
    // Primero, verificamos si el valor es una cadena
    if (typeof value !== 'string') {
        return false;
    }

    // Comprobamos si la cadena comienza y termina con '#'
    if (value.startsWith('#') && value.endsWith('#')) {
        // Contamos el número de veces que aparece '#' en la cadena
        const countHash = value.split('#').length - 1;

        // Un valor dinámico único debe tener exactamente 2 '#'
        return countHash === 2;
    }

    return false;
}

function extractAndSetDynamicValue(text, endPoint, _self) {
    const phraseOrWord  = str => str.startsWith('#') && str.endsWith('#');
    const setValueText  = (str, vals) => util.format(str.replace(/#(.*?)#/g, '%s'), ...vals);
    const dynamicValues = (text.match(/#([a-zA-Z0-9_]+)#/g) || []).map(value => _self._loadDynamicData(value, endPoint));
    return phraseOrWord(text) ? dynamicValues[0] : setValueText(text, dynamicValues);
}

function assertionE2E(elementType, element, assertion, value, endPoint, _self) {
    const expectFn = {
        'have.text' : (element, text) => element.should(assertion, text),
        'be.visible': (element) => element.should(assertion),
        'url.eq'    : (element, value) => element.should('eq', value),
    }
    return expectFn[assertion](element, value);
}

function assertionMap(responseValue, value, assertion, endPoint, field, _self) {
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
        'instanceof'          : () => expect(responseValue).to.not.be.an.instanceof(value),
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

function isValidInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

function convertFieldToArray(field) {
    return field.split(/\[(.*?)\]|\.+/).filter(Boolean)
}

function getChaiAssertion(assertMap, conditional) {
    const assertion = assertMap[conditional];
    if (!assertion) {
        throw new Error(`Conditional '${conditional}' not found`);
    }
    return assertion;
}

function getNestedPropertyValue(object, path) {
    return path.reduce((obj, segment) => {
        if (Array.isArray(obj)) {
            // Manejo de índices de arrays
            const index = parseInt(segment, 10);
            if (isNaN(index) || index >= obj.length) {
                throw new Error(`Array index "${segment}" is invalid or out of range in the response.`);
            }
            return obj[index];
        } else {
            // Verificar la existencia de la propiedad
            if (!obj || !obj.hasOwnProperty(segment)) {
                throw new Error(`The field "${segment}" does not exist in the response.`);
            }
            return obj[segment];
        }
    }, object);
}

function normalizeValue(value) {

    //validated isNum
    if (isValidInteger(value)) {
        return Number(value);
    }

    // Normalización para valores nulos o indefinidos
    if (value === null || value === undefined) {
        return null;
    }

    // Normalización para números
    if (typeof value === 'number') {
        // Puede incluir lógica adicional para manejar números especiales, como NaN o Infinity
        return value;
    }

    // Normalización para cadenas de texto
    if (typeof value === 'string') {
        // Convertir a minúsculas, remover espacios extra, etc.
        const lowerCaseValue = value.trim().toLowerCase();
        if (['true', 'false'].includes(lowerCaseValue)) {
            return lowerCaseValue === 'true';
        } else {
            return value.trim();
        }

    }

    // Normalización para booleanos
    if (typeof value === 'boolean') {
        return value;
    }

    // Normalización para fechas
    if (value instanceof Date) {
        // Convertir a un formato de fecha estándar o a timestamp
        return value.toISOString();
    }

    // Normalización para arrays
    if (Array.isArray(value)) {
        // Aplicar normalización a cada elemento del array
        return value.map(element => normalizeValue(element));
    }

    // Normalización para objetos
    if (typeof value === 'object') {
        // Aplicar normalización a cada propiedad del objeto
        return Object.keys(value).reduce((normalizedObj, key) => {
            normalizedObj[key] = normalizeValue(value[key]);
            return normalizedObj;
        }, {});
    }

    // En caso de que el valor no corresponda a ningún tipo conocido
    throw new Error(`Unable to normalize value of type: ${typeof value}`);
}

function getNumberDate(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return Math.floor(date / 1000)
}

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
}