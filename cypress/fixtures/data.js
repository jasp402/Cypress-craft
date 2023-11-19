class Data {
    constructor(environment) {
        this.env  = environment[0];
        this.live = environment[1] === 'live';
    }

    constants() {
        //here set data constant for all environments
    }

    #getDefaultData() {
        return {
            "DATA": this.live ? 'Indistinto del ambiente' : 'Indistinto del ambiente2',
        }
    }

    #getEnvironmentSpecificData() {
        return {
            dev: {},
            qa : {
                // Datos específicos para 'qa' pero generales para todos los tipos
                TOKEN_ID_LENGTH_MIN: this.live ? 'tkn_live_faJ717Z' : 'tkn_test_faJ717Z',
                // Resto de la configuración específica de 'qa'
            },
            pro: {}
        }
    }

    #getTypeSpecificData() {
        return {
            posts   : {
                DATA: this.live ? 'Indistinto del ambiente5' : 'Indistinto del ambiente6',
                // Datos específicos para 'posts' pero generales para todos los entornos
                ...(this.env === 'dev' && { // Datos específicos para 'posts' en 'dev'
                    MERCHANT: {
                        "NAME": this.live ? "Tetsu10" : "pruebas token 01",
                        // Resto de la configuración específica de 'posts'
                    },
                    // Otros datos específicos de 'posts' para 'dev'
                }),
                ...(this.env === 'qa'  && { // Datos específicos para 'posts' en 'qa'
                    MERCHANT: {
                        "NAME": this.live ? "Tetsu10" : "pruebas token 01",
                        // Resto de la configuración específica de 'posts'
                    },
                    // Otros datos específicos de 'posts' para 'qa'
                }),
                ...(this.env === 'pro' && { // Datos específicos para 'posts' en 'pro'
                    MERCHANT: {
                        "NAME": this.live ? "Tetsu10" : "pruebas token 01",
                        // Resto de la configuración específica de 'posts'
                    },
                    // Otros datos específicos de 'posts' para 'pro'
                })
            },
            comments: { // Datos específicos para 'comments' pero generales para todos los entornos
                ...(this.env === 'dev' && {
                    TOKEN_ID_LENGTH_MIN: this.live ? 'tkn_live_faJ717Z' : 'tkn_test_faJ717Z',
                    // Resto de la configuración específica de 'comments'
                }),
                ...(this.env === 'qa'  && {
                    TOKEN_ID_LENGTH_MIN: this.live ? 'tkn_live_faJ717Z' : 'tkn_test_faJ717Z',
                    // Resto de la configuración específica de 'comments'
                }),
                ...(this.env === 'pro' && {
                    TOKEN_ID_LENGTH_MIN: this.live ? 'tkn_live_faJ717Z' : 'tkn_test_faJ717Z',
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
        Object.keys(environmentData).forEach(key => {
            if (keysSet.has(key)) {
                throw new Error(`There are duplicate keys detected: '[${key}]'. Please review the '${__filename}' file for overlapping key definitions.`);
            }
        });
    }

    getData() {
        const defaultData             = this.#getDefaultData();
        const environmentSpecificData = this.#getEnvironmentSpecificData();
        const typeSpecificData        = this.#getTypeSpecificData();

        this.#validateUniqueKeys(defaultData, environmentSpecificData[this.env]);
        let specificData = Object.keys(typeSpecificData).reduce((acc, type) => {
            acc[type] = typeSpecificData[type];
            return acc;
        }, {});
        return {
            ...defaultData,
            ...environmentSpecificData[this.env],
            ...specificData
        };
    }

}

module.exports = (env) => new Data(env);