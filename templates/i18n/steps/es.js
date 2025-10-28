//ES
export default {
    //COMMON
    '@COMMON_GIVEN_INIT_POM': 'la configuración del POM ha sido inicializada para {string}',
    //API
    '@API_WHEN_REQUEST_SENT'       : 'una petición {word} es enviada al endpoint {string}',
    '@API_SHOW_REQUEST_OR_RESPONSE': /^se muestre la (petición|respuesta) de "([^"]*)"?$/,
    '@API_THEN_VALIDATE_RESPONSE'  : 'la respuesta en {string} debe tener el parámetro {string} con la condición {string} y el valor {string}',
    //E2E
    '@USER_ENTRE_PAGE'         : 'el usuario ingresa a la pagina {word}',
    '@USER_ACTION_INTO_ELEMENT': /^el usuario (hace clic|escribe|selecciona|...) en el (botón|campo|link|...) "([^"]*)"?(?: con el valor "([^"]*)")?$/,
    '@USER_VALIDATE_ELEMENT'   : /^(el elemento|la sección|el campo|el boton|la lista|la imagen|...) "([^"]*)" debe "([^"]*)"?(?: "([^"]*)")?$/,

}