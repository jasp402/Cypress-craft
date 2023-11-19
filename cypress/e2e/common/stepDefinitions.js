import {Given, When,Then} from "@badeball/cypress-cucumber-preprocessor";
import main from '../../pom/main.pom';
import pom from '../../pom';
let pageObject = null;

Given('the Page Object Model configuration for {string} has been initialized', (name) => {
    pageObject = pom[name];
});

When('a {word} request is sent to the {word} endpoint', (method, endPoint, settings) => {
    pageObject.sendRequest(method, endPoint, settings);
});
