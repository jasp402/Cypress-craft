//EN
export default {
    //COMMON
    '@COMMON_GIVEN_INIT_POM': 'the Page Object Model configuration for {string} has been initialized',
    //API
    '@API_WHEN_REQUEST_SENT'       : 'a {word} request is sent to the {string} endpoint',
    '@API_SHOW_REQUEST_OR_RESPONSE': /^I show the "([^"]*)" endpoint (request|response)?$/,
    '@API_THEN_VALIDATE_RESPONSE'  : 'the response on {string} should have the parameter {string} with condition {string} and value {string}',
    //E2E
    '@USER_ENTRE_PAGE'         : 'the user enters the {word} page',
    '@USER_ACTION_INTO_ELEMENT': /^the user should (clic|type|select|actions|...) in the (button|field|link|fields|elements|...) "([^"]*)"?(?: with value "([^"]*)")?$/,
    '@USER_VALIDATE_ELEMENT'   : /^the (element|section|field|button|list|image|...) "([^"]*)" should "([^"]*)"?(?: "([^"]*)")?$/,
}