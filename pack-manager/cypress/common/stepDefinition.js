

    // CC_CAPTURE_SCREEN_STEP_DEF_START
    /* global When, pageObject */
    
    // step: capture full page screenshot as evidence
    When('el usuario captura evidencia de la pantalla', () => {
        pageObject._screenshot();
    });
    
    // CC_CAPTURE_SCREEN_STEP_DEF_END