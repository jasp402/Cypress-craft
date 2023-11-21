const util = require("util");

function isDynamic(value) {
    return Boolean(/#([a-zA-Z0-9_]+)#/g.test(value));
}

function extractAndSetDynamicValue(text, endPoint, _self) {
    const phraseOrWord  = str => str.startsWith('#') && str.endsWith('#');
    const setValueText  = (str, vals) => util.format(str.replace(/#(.*?)#/g, '%s'), ...vals);
    const dynamicValues = (text.match(/#([a-zA-Z0-9_]+)#/g) || []).map(value => _self._loadDynamicData(value, endPoint));
    return phraseOrWord(text) ? dynamicValues[0] : setValueText(text, dynamicValues);
}

function assertionMap(responseValue, value, endPoint, field, _self) {
    return {
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
}

    module.exports = {
        isDynamic,
        extractAndSetDynamicValue,
        assertionMap
    }