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
                    body: JSON.stringify(this.data.posts.bodyDefault),
                };
                break;
            case 'GET' :
                options = {
                    ...commonOptions,
                    method,
                    body: null,
                };
                break;
            // Add additional methods PATCH, DELETE, etc.
            default:
                throw new Error(`Invalid method ${method}`);
        }

        if (Object.keys(settings).length > 0)
            options = super._applyDynamicSettings(options, settings, endPoint);

        this.request[endPoint] = options;
        super._setRequest(endPoint, options);
    }
}
module.exports = new Posts();