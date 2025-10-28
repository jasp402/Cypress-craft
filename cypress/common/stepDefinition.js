import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import pom from '../pom';
let pageObject = null;


// --- Common Steps (shared across modules) ---
// Common steps (shared across all modules)
Given('@COMMON_GIVEN_INIT_POM', (name) => {
    pageObject = pom[name];
    pageObject._loadEndPoint(name);
});


