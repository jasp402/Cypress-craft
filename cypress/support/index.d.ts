// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

import * as string_decoder from "string_decoder";

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Custom command to log messages in a formatted way.
         * @param title Title of the log message
         * @param content Content to be logged
         * @param type Type of the log ('assertion' or other)
         */
        logManager(title: string, content: any, type: string): Chainable<Subject>;
    }
}
