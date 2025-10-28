// Common steps (shared across all modules)
Given('@COMMON_GIVEN_INIT_POM', (name) => {
    pageObject = pom[name];
    pageObject._loadEndPoint(name);
});
