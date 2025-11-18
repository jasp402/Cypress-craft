# language: es
Característica: CULQI API | Suite 006: Pruebas del métodos [POST] - [CAPTURAR CARGOS]
  Más información viste: https://apidocs.culqi.com/#tag/Cargos/operation/capturar-cargo


  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "charges"
    Dado los datos de la tarjeta "VISA"
    Dado un correo temporal

  Escenario: CP001 - API [CAPTURAR-CARGO] | Crear cargo con capture = FALSE - Capturarlo y re-capturarlo (Comercio PSP)
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body               |
      | {"capture": false} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición POST es enviada al endpoint "charges"
      | url                            |
      | #BASE_URL#/#CHARGE_ID#/capture |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Cuando una petición POST es enviada al endpoint "charges"
      | url                            |
      | #BASE_URL#/#CHARGE_ID#/capture |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                 |
      | charges | status                | es igual a   | 401                   |
      | charges | body.merchant_message | que contiene | ya ha sido capturado. |

  Escenario: CP002 - API [CAPTURAR-CARGO] | Crear cargo con capture = TRUE y capturarlo
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"capture": true} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición POST es enviada al endpoint "charges"
      | url                            |
      | #BASE_URL#/#CHARGE_ID#/capture |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                 |
      | charges | status                | es igual a   | 401                   |
      | charges | body.merchant_message | que contiene | ya ha sido capturado. |

  @skip
  Escenario: CP003 - API [CAPTURAR-CARGO] | Con estado de transacción Rechazada (Denegada adquiriente).
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                 |
      | {"decline_code": "venta_denegada"} |
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                            |
      | #BASE_URL#/#CHARGE_ID#/capture |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                     |
      | charges | status                | es igual a   | 401                                       |
      | charges | body.object           | es igual a   | error                                     |
      | charges | body.type             | es igual a   | parameter_error                           |
      | charges | body.merchant_message | que contiene | ha sido rechazado, no puede ser devuelto. |

  Escenario: CP004 - API [CAPTURAR-CARGO] | Con estado de transacción es Devuelta.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición POST es enviada al endpoint "refunds"
    Cuando se muestre la petición de "refunds"
    Cuando se muestre la respuesta de "refunds"
    Cuando una petición POST es enviada al endpoint "charges"
      | url                            |
      | #BASE_URL#/#CHARGE_ID#/capture |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                      |
      | charges | status                | es igual a   | 401                        |
      | charges | body.object           | es igual a   | error                      |
      | charges | body.type             | es igual a   | parameter_error            |
      | charges | body.merchant_message | que contiene | ya ha sido devuelto.       |
#      | charges | body.merchant_message | que contiene | #CHARGE_ID_STATE_DEVUELTA# |

  Escenario: CP005 - API [CAPTURAR-CARGO] | Que pertenece a otro comercio.
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                           |
      | #BASE_URL#/#CHARGE_ID_OTHER_MERCHANT#/capture |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                     |
      | charges | status                | es igual a   | 400                                       |
      | charges | body.object           | es igual a   | error                                     |
      | charges | body.type             | es igual a   | parameter_error                           |
      | charges | body.merchant_message | que contiene | No existe el cargo que intentas capturar: |
      | charges | body.merchant_message | que contiene | #CHARGE_ID_OTHER_MERCHANT#                |

  Escenario: CP006 - API [CAPTURAR-CARGO] | Con un (id) de cargo mayor a 25 caracteres (enviar 24 caracteres).
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                       |
      | #BASE_URL#/#CHARGE_ID_LENGTH_MIN#/capture |
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP007 - API [CAPTURAR-CARGO] | Con un (id) de cargo mayor a 25 caracteres (enviar 26 caracteres).
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                       |
      | #BASE_URL#/#CHARGE_ID_LENGTH_MAX#/capture |
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP008 - API [CAPTURAR-CARGO] | Con (id) de cargo cuyo ambiente sea diferente al de la llave privada
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                        |
      | #BASE_URL#/#CHARGE_ID_ENV_INVALID#/capture |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP009 - API [CAPTURAR-CARGO] | Con endpoint inválido (Usar la ruta secure).
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                   |
      | #SECURE_URL#/#CHARGE_ID_FAKE#/capture |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters   | condition    | value                                                                    |
      | charges | status       | es igual a   | 403                                                                      |
      | charges | body.message | que contiene | Invalid key=value pair (missing equal-sign) in Authorization header (hashed with SHA-256 and encoded with Base64): |

  #Failed test - (Other)
  Escenario: CP010 - API [CAPTURAR-CARGO] | Con código de comercio (llave pública - pk)
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                 | headers                          |
      | #BASE_URL#/#CHARGE_ID_FAKE#/capture | {"Authorization" : "#PK#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                          |
      | charges | status                | es igual a | 401                                                                                                            |
      | charges | body.object           | es igual a | error                                                                                                          |
      | charges | body.type             | es igual a | authentication_error                                                                                           |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información. |

  Escenario: CP011 - API [CAPTURAR-CARGO] | Con llave privada (sk) inválida.
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                 | headers                                     |
      | #BASE_URL#/#CHARGE_ID_FAKE#/capture | {"Authorization" : "#MERCHANT_SK_INVALID#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                          |
      | charges | status                | es igual a | 401                                                                                                            |
      | charges | body.object           | es igual a | error                                                                                                          |
      | charges | body.type             | es igual a | authentication_error                                                                                           |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información. |

  Escenario: CP012 - API [CAPTURAR-CARGO] | Con llave privada (sk) no activa.
    Cuando una petición POST es enviada al endpoint "charges"
      | url                                 | headers                                         |
      | #BASE_URL#/#CHARGE_ID_FAKE#/capture | {"Authorization" : "#MERCHANT_SK_DEACTIVATED#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                          |
      | charges | status                | es igual a | 401                                                                                                            |
      | charges | body.object           | es igual a | error                                                                                                          |
      | charges | body.type             | es igual a | authentication_error                                                                                           |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información. |
