import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import pom from '../pom';
let pageObject = null;

Given('la configuración del POM ha sido inicializada para {string}', (name) => {
    pageObject = pom[name];
    pageObject._loadEndPoint(name);
});

//add steps API
//add steps E2E
