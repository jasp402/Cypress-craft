// When a request is sent
When('@API_WHEN_REQUEST_SENT', (method, endPoint, settings) => {
    pageObject.sendRequest(method, endPoint, settings);
});

//When a request response show logs...
When(@API_SHOW_REQUEST_OR_RESPONSE, (endPoint, type) => {
    pageObject._showManager(type, endPoint);
});

// Then the response should have...
Then('@API_THEN_VALIDATE_RESPONSE', (endPoint, field, condition, value) => {
    pageObject._validateResponse(endPoint, field, condition, value);
});
