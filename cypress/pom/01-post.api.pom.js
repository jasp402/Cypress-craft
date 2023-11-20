import Main from './main.pom.js';
class Posts extends Main {
    constructor() {
        super();
    }

    sendRequest(method, endPoint, settings) {
        settings = settings?.hashes()[0] || {};
        method   = super._validateMethod(method);
        let options = {};

        const commonOptions = {
            url             : this.urls[endPoint],
            headers         : {},
            qs              : {},
            timeout         : 60000,
            failOnStatusCode: false,
        };

        switch (method) {
            case 'POST':
                options = {
                    ...commonOptions,
                    method,
                    body: JSON.stringify({
                        title: 'foo',
                        body: 'bar',
                        userId: 1,
                    }),
                };
                break;
            case 'GET':
                options = {
                    ...commonOptions,
                    method,
                    body: null,
                };
                break;
            // Añadir más casos si es necesario para otros métodos como PATCH, DELETE, etc.
            default:
                throw new Error(`Invalid method ${method}`);
        }
        this.request[endPoint] = options;

        cy.log(this.request);

        super._setRequest(endPoint, options);
    }

}
export const className = 'Posts';
module.exports = new Posts();