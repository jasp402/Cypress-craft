module.exports = class Main {


    // CC_CAPTURE_SCREEN_POM_FUNC_START
    /* eslint-disable */
    // noinspection All
    
    _screenshot() {
        const times = new Date().getTime();
        cy.screenshot(`${times}`, { timeout: 30000, capture: 'fullPage' });
    }
    
    // CC_CAPTURE_SCREEN_POM_FUNC_END
}