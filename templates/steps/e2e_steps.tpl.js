Given('@USER_ENTRE_PAGE', (endPoint) => {
    pageObject._open(endPoint);
});

When(@USER_ACTION_INTO_ELEMENT, (action, elementType, elementId, content) => {
    pageObject.sendAction(action, elementType, elementId, content);
});

Then(@USER_VALIDATE_ELEMENT, (elementType, elementId, condition, content) => {
    pageObject._validate(elementType, elementId, condition, content);
});
