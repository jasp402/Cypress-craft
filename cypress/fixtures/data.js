class Data {
    constructor(environment) {
        this.env  = environment[0];
        this.live = environment[1] === 'live' || false;
    }

    constants() {
        //here set data constant for all environments
        return {
            SERVICES_LIST   : ['posts', 'comments', 'login', 'products'],
            METHODS_LIST    : [
                'POST',
                'GET',
                'PUT',
                'DELETE',
                'PATCH'
            ],
            CONDITIONALS_MAP: {
                'es igual a'                     : 'equal', //ES_es
                'is equal to'                    : 'equal', //EN_en
                'es estructuralmente igual a'    : 'deep.equal',
                'que inicia con'                 : 'startsWith',
                'hace match con'                 : 'match',
                'que es mayor a'                 : 'above',
                'que es diferente a'             : 'not.equal',
                'que es menor a'                 : 'below',
                'que es mayor o igual a'         : 'least',
                'que es menor o igual a'         : 'most',
                'que es distinto de'             : 'not.equal',
                'que contiene'                   : 'include',
                'que no contiene'                : 'not.include',
                'que es verdadero'               : 'true',
                'que es falso'                   : 'false',
                'que es nulo'                    : 'null',
                'que no es nulo'                 : 'not.null',
                'que esta definido'              : 'undefined',
                'que no esta definido'           : 'not.undefined',
                'que es NaN'                     : 'NaN',
                'que no es NaN'                  : 'not.NaN',
                'que es instancia de'            : 'instanceof',
                'que no es instancia de'         : 'not.instanceof',
                'que es una propiedad'           : 'have.property',
                'que es una propiedad anidada de': 'have.nested.property',
                'en el index [0] de'             : 'have.property.index',
                'tiene una longitud igual a'     : 'equal.length',
                'tiene una longitud mayor a'     : 'above.length',
                'tiene una longitud menor a'     : 'below.length',

            },
            CONDITIONALS_MAP_E2E: {
                'tiene el texto': 'have.text',  //ES_es
                'ser visible'   : 'be.visible', //ES_es
                'tener la ruta' : 'url.eq',  //ES_es,
            },
        }
    }

    #getDefaultData() {
        return {}
    }

    #getEnvironmentSpecificData() {
        const result = {
            dev: {},
            qa : {},
            pro: {}
        }
        return result[this.env];
    }

    #getTypeSpecificData() {
        return {
            posts   : {
                // Datos específicos para 'posts' pero generales para todos los entornos
                ...(this.env === 'dev' && { // Datos específicos para 'posts' en 'dev'
                    // Otros datos específicos de 'posts' para 'dev'
                }),
                ...(this.env === 'qa' && { // Datos específicos para 'posts' en 'qa'
                    // Otros datos específicos de 'posts' para 'qa'
                }),
                ...(this.env === 'prod' && { // Datos específicos para 'posts' en 'prod'
                    bodyCreate: {
                        title : 'Create Default Posts',
                        body  : 'This is demo information for the default post',
                        userId: 1,
                    },
                    bodyUpdate : {
                        title : 'Update Default Posts',
                        body  : 'This is demo information for the updated post',
                        userId: 1,
                    }
                    // Otros datos específicos de 'posts' para 'prod'
                })
            },
            comments: { // Datos específicos para 'comments' pero generales para todos los entornos
                ...(this.env === 'dev' && {
                    // Resto de la configuración específica de 'comments'
                }),
                ...(this.env === 'qa' && {
                    // Resto de la configuración específica de 'comments'
                }),
                ...(this.env === 'prod' && {
                    // Resto de la configuración específica de 'comments'
                }),
            },
            // Configuraciones para otros tipos (albums, photos, etc.)
        }
    }

    #validateUniqueKeys(defaultData, environmentData) {
        let keysSet = new Set();
        // Agregar y verificar claves de defaultData
        Object.keys(defaultData).forEach(key => {
            keysSet.add(key);
        });
        // Verificar claves de environmentData
        if (environmentData) {
            Object.keys(environmentData).forEach(key => {
                if (keysSet.has(key)) {
                    throw new Error(`There are duplicate keys detected: '[${key}]'. Please review the '${__filename}' file for overlapping key definitions.`);
                }
            });
        }
    }

    getData() {
        const defaultData             = this.#getDefaultData();
        const environmentSpecificData = this.#getEnvironmentSpecificData();
        const typeSpecificData        = this.#getTypeSpecificData();

        this.#validateUniqueKeys(defaultData, environmentSpecificData);
        let specificData = Object.keys(typeSpecificData).reduce((acc, type) => {
            acc[type] = typeSpecificData[type];
            return acc;
        }, {});
        return {
            ...defaultData,
            ...environmentSpecificData,
            ...specificData
        };
    }
}

module.exports = (env) => new Data(env);