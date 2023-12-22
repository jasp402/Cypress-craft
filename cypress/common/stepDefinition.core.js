import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import pom from '../pom';
let pageObject = null;


Given('the Page Object Model configuration for {string} has been initialized', (name) => {
    pageObject = pom[name];
    pageObject._loadEndPoint(name);
});

/** ------------------------------------------------ **/
/** Steps definitions for the API .feature file - EN **/
/** ------------------------------------------------ **/
When('a {word} request is sent to the {string} endpoint', (method, endPoint, settings) => {
    pageObject.sendRequest(method, endPoint, settings);
});

When('I show the {string} endpoint {word}', (endPoint, type) => {
    pageObject._showManager(type, endPoint);
});

Then('the response on {string} should have the parameter {string} with condition {string} and value {string}', (endpoint, field, condition, value) => {
    pageObject._validateResponse(endpoint, field, condition, value);
});


/** --------------------------------------------------- **/
/** Steps definitions for the API .feature file - ES_es **/
/** --------------------------------------------------- **/
When('una petición {word} es enviada al endpoint {string}', (method, endPoint, settings) => {
    pageObject.sendRequest(method, endPoint, settings);
});

When(/^se muestre la (petición|respuesta) de "([^"]*)"?$/, (endPoint, type) => {
    pageObject._showManager(type, endPoint);
});

Then('la respuesta en {string} debe tener el parámetro {string} con la condición {string} y el valor {string}', (endpoint, field, condition, value) => {
    pageObject._validateResponse(endpoint, field, condition, value);
});

/** --------------------------------------------------- **/
/** Steps definitions for the E2E .feature file - EN_en **/
/** --------------------------------------------------- **/
Given('the user enters the {word} page', (endPoint) => {
    pageObject._open(endPoint);
});

When(/^the user should (clic|type|select|actions|...) in the (button|field|link|fields|elements|...) "([^"]*)"?(?: with value "([^"]*)")?$/, (action, elementType, elementId, content) => {
    pageObject.sendAction(action, elementType, elementId, content);
});

Then(/^the (element|section|field|button|list|image|...) "([^"]*)" should "([^"]*)"?(?: "([^"]*)")?$/, (elementType, elementId, condition, content) => {
    pageObject._validate(elementType, elementId, condition, content);
});

/** --------------------------------------------------- **/
/** Steps definitions for the E2E .feature file - ES_es **/
/** --------------------------------------------------- **/
Given('el usuario ingresa a la pagina {word}', (endPoint) => {
    pageObject._open(endPoint);
});

When(/^el usuario (hace clic|escribe|selecciona|...) en el (botón|campo|link|...) "([^"]*)"?(?: con el valor "([^"]*)")?$/, (action, elementType, elementId, content) => {
    pageObject.sendAction(action, elementType, elementId, content);
});

Then(/^(el elemento|la sección|el campo|el boton|la lista|la imagen|...) "([^"]*)" debe "([^"]*)"?(?: "([^"]*)")?$/, (elementType, elementId, condition, content) => {
    pageObject._validate(elementType, elementId, condition, content);
});






