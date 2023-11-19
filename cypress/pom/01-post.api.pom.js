import Main from './main.pom.js';
class Posts extends Main {
    constructor() {
        super();
    }

    sendRequest(method, endPoint, settings) {
        let url = this.urls[endPoint];
        cy.log(url);
        // let body = this._getBody(settings);
        // let headers = this._getHeaders(settings);
        // switch (method) {
        //     case 'post':
        //         return this._post(url, body, headers);
        //     default:
        //         throw new Error(`Invalid method ${method}`);
        // }
    }

}
export const className = 'Posts';
module.exports = new Posts();