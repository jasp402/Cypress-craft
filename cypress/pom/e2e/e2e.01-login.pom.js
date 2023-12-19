import Main from '../main.pom.js';

class Login extends Main {
    constructor() {
        const elements = {
            usernameInput: () => cy.get('#user-name'),
            passwordInput: () => cy.get('#password'),
            loginBtn     : () => cy.get('#login-button'),
            errorMessage : () => cy.get('h3[data-test="error"]'),
            url          : ()      => cy.url(),
            title        : () => cy.get('title'),
            shoppingCart : () => cy.get('a.shopping_cart_link'),

        };
        super(elements);
    }

    sendAction(action, elementType, elementId, content) {
        let element = super._getElement(elementId);
        switch (elementType) {
            case 'link':
                element.click();
                break;
            case 'botón':
                element.click();
                break;
            case 'campo':
                element.type(content);
                break;
            default:
                throw new Error(`Invalid element type ${elementType}`);
        }
    }
}

export default new Login();