import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import pom from '../../pom';
let pageObject = null;

/** ------------------------------------------- **/
/** Steps definitions for the API .feature file **/
/** ------------------------------------------- **/

Given('the Page Object Model configuration for {string} has been initialized', (name) => {
    pageObject = pom[name];
});

When('a {word} request is sent to the {string} endpoint', (method, endPoint, settings) => {
    pageObject.sendRequest(method, endPoint, settings);
});

When('I show the {string} endpoint {word}', (endPoint, type) => {
    pageObject._showManager(type, endPoint);
});

Then('the response on {string} should have the parameter {string} with condition {string} and value {string}', (endpoint, field, condition, value) => {
    pageObject._validateResponse(endpoint, field, condition, value);
});

/** ------------------------------------------- **/
/** Steps definitions for the E2E .feature file **/
/** ------------------------------------------- **/

Given('A user enters to the login page', ()=>{
    cy.visit('https://www.saucedemo.com');
})

When('A user enters the username {string}', (username)=>{
    LoginPage.typeUsername(username);
})


When('A user enters incorrect credentials', (dataTable)=>{
    dataTable.hashes().forEach(row => {
        LoginPage.typeUsername(row.username);
        LoginPage.typePassword(row.password);
    });
})

When('A user enters the password {string}', (password)=>{
    LoginPage.typePassword(password);
})

When('A user clicks on the login button', ()=>{
    LoginPage.clickLogin();
})

Then('A user will be logged in', ()=>{
    LoginPage.urlSuccess();
})

Then('The error message {string} is displayed', (errorMessage)=>{
    LoginPage.msjError(errorMessage);
    cy.screenshot();
})






