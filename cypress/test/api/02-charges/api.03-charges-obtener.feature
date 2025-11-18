# language: es

Característica: CULQI API | Suite 003: Pruebas del métodos [GET] - [CONSULTAR CARGOS]
  Más información viste: https://apidocs.culqi.com/#tag/Cargos/operation/consultar-cargo

  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "charges"
    Dado los datos de la tarjeta "VISA DEBITO"
    Dado un correo temporal

  Escenario: CP001 - API [CONSULTAR-CARGO] | Con un (id) de cargo válido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición GET es enviada al endpoint "charges"
      | url                    |
      | #BASE_URL#/#CHARGE_ID# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                    | condition                       | value                                                 |
      | charges | status                        | es igual a                      | 200                                                   |
      | charges | body.id                       | que inicia con                  | chr_                                                  |
      | charges | body.object                   | es igual a                      | charge                                                |
      | charges | body.id                       | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.amount                   | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded          | es igual a                      | 0                                                     |
      | charges | body.current_amount           | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments             | es igual a                      | 0                                                     |
      | charges | body.installments_amount      | que no es nulo                  | null                                                  |
      | charges | body.currency_code            | es igual a                      | PEN                                                   |
      | charges | body.description              | que es nulo                     | null                                                  |
      | charges | body.source                   | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object            | es igual a                      | token                                                 |
      | charges | body.source.id                | es igual a                      | #TOKEN_ID#                                            |
      | charges | body.source.type              | es igual a                      | card                                                  |
      | charges | body.source.iin               | que es una propiedad anidada de | body.source                                           |
      | charges | body.source.iin.object        | es igual a                      | iin                                                   |
      | charges | body.source.iin.card_brand    | es igual a                      | #CARD_BRAND#                                          |
      | charges | body.source.iin.card_category | que no es nulo                  | null                                                  |
      | charges | body.outcome.type             | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code             | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message     | es igual a                      | Su compra ha sido exitosa.                             |
      | charges | body.dispute                  | es igual a                      | false                                                 |
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                    | body                             |
      | #BASE_URL#/#CHARGE_ID# | {"metadata": {"dni":"71702324"}} |
    Cuando se muestre la respuesta de "charges"
    Cuando una petición GET es enviada al endpoint "charges"
      | url                    |
      | #BASE_URL#/#CHARGE_ID# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters        | condition      | value       |
      | charges | status            | es igual a     | 200         |
      | charges | body.id           | que inicia con | chr_        |
      | charges | body.object       | es igual a     | charge      |
      | charges | body.id           | es igual a     | #CHARGE_ID# |
      | charges | body.metadata.dni | es igual a     | 71702324    |
  
  #Esto esta bajo observación: https://appculqi.atlassian.net/browse/C2ONGECFIS-2342
  Escenario: CP002 - API [CONSULTAR-CARGO] | Con un (id) de cargo válido - Listando Cargos primero.
    Cuando una petición GET es enviada al endpoint "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición GET es enviada al endpoint "charges"
      | url                    |
      | #BASE_URL#/#CHARGE_ID# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                    | condition                       | value           |
      | charges | status                        | es igual a                      | 200             |
      | charges | body.id                       | que inicia con                  | chr_            |
      | charges | body.object                   | es igual a                      | charge          |
      | charges | body.id                       | es igual a                      | #CHARGE_ID#     |
      | charges | body.amount                   | es igual a                      | #CHARGE_AMOUNT# |
#	  | charges | body.amount_refunded          | es igual a                      | 0                                                     |
#	  | charges | body.current_amount           | es igual a                      | #CHARGE_AMOUNT#                                                   |
      | charges | body.installments             | es igual a                      | 0               |
      #| charges | body.installments_amount      | que es nulo                     | null                                                  |
      | charges | body.currency_code            | es igual a                      | PEN             |
#      | charges | body.description              | que no es nulo                  | null                                                  |
      | charges | body.source                   | que es una propiedad anidada de | body            |
      | charges | body.source.object            | es igual a                      | token           |
      #| charges | body.source.id                | es igual a                      | #TOKEN_ID#                                            |
      #| charges | body.source.type              | es igual a                      | card                                                  |
      | charges | body.source.iin               | que es una propiedad anidada de | body.source     |
      | charges | body.source.iin.object        | es igual a                      | iin             |
      | charges | body.source.iin.card_brand    | es igual a                      | #CARD_BRAND#    |
      | charges | body.source.iin.card_category | que no es nulo                  | null            |
#	  | charges | body.outcome.type             | es igual a                      | venta_exitosa                                         |
#	  | charges | body.outcome.code             | es igual a                      | AUT0000                                               |
#	  | charges | body.outcome.merchant_message | es igual a                      | La operación de venta ha sido autorizada exitosamente |
#	  | charges | body.outcome.user_message     | es igual a                      | Su compra ha sido exitosa                            |
#	  | charges | body.dispute                  | es igual a                      | false                                                 |

  Escenario: CP003 - API [CONSULTAR-CARGO] | Que pertenece a otro comercio.
    Cuando una petición GET es enviada al endpoint "charges"
      | url                                   |
      | #BASE_URL#/#CHARGE_ID_OTHER_MERCHANT# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                      |
      | charges | status                | es igual a   | 400                                        |
      | charges | body.object           | es igual a   | error                                      |
      | charges | body.type             | que contiene | parameter_error                            |
      | charges | body.merchant_message | que contiene | No existe el cargo que intentas consultar: |

  Escenario: CP004 - API [CONSULTAR-CARGO] | Enviar un ID de cargo con menos de la cantidad mínima de caracteres.
    Cuando una petición GET es enviada al endpoint "charges"
      | url                               |
      | #BASE_URL#/#CHARGE_ID_LENGTH_MIN# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                              |
      | charges | status                | es igual a   | 401                                                                |
      | charges | body.object           | es igual a   | error                                                              |
      | charges | body.type             | que contiene | authentication_error                                               |
      | charges | body.merchant_message | es igual a   | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP005 - API [CONSULTAR-CARGO] | Enviar un ID de cargo con más de la cantidad máxima de caracteres.
    Cuando una petición GET es enviada al endpoint "charges"
      | url                               |
      | #BASE_URL#/#CHARGE_ID_LENGTH_MAX# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                              |
      | charges | status                | es igual a   | 401                                                                |
      | charges | body.object           | es igual a   | error                                                              |
      | charges | body.type             | que contiene | authentication_error                                               |
      | charges | body.merchant_message | es igual a   | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP006 - API [CONSULTAR-CARGO] | Enviar un ID de cargo que no existe.
    Cuando una petición GET es enviada al endpoint "charges"
      | url                              |
      | #BASE_URL#/#CHARGE_ID_NOT_EXIST# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                      |
      | charges | status                | es igual a   | 400                                        |
      | charges | body.object           | es igual a   | error                                      |
      | charges | body.type             | que contiene | parameter_error                            |
      | charges | body.merchant_message | que contiene | No existe el cargo que intentas consultar: |

  Escenario: CP007 - API [CONSULTAR-CARGO] | Con (id) de cargo cuyo ambiente no existe (local)
    Cuando una petición GET es enviada al endpoint "charges"
      | url                                |
      | #BASE_URL#/#CHARGE_ID_ENV_INVALID# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                              |
      | charges | status                | es igual a   | 401                                                                |
      | charges | body.object           | es igual a   | error                                                              |
      | charges | body.type             | que contiene | authentication_error                                               |
      | charges | body.merchant_message | es igual a   | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP008 - API [CONSULTAR-CARGO] | Con endpoint incorrecto.
    Cuando una petición GET es enviada al endpoint "charges"
      | url                           |
      | #SECURE_URL#/#CHARGE_ID_FAKE# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters   | condition    | value                                                                                                              |
      | charges | status       | es igual a   | 403                                                                                                                |
      | charges | body.message | que contiene | Invalid key=value pair (missing equal-sign) in Authorization header (hashed with SHA-256 and encoded with Base64): |

  Escenario: CP009 - API [CONSULTAR-CARGO] | Con código de comercio (llave pública - PK)
    Cuando una petición GET es enviada al endpoint "charges"
      | url                         | headers                    |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : "#PK#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                                                                                      |
      | charges | status                | es igual a   | 401                                                                                                                        |
      | charges | body.object           | es igual a   | error                                                                                                                      |
      | charges | body.type             | que contiene | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a   | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a   | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP010 - API [CONSULTAR-CARGO] | Sin enviar un código de comercio (llave privada - SK)
    Cuando una petición GET es enviada al endpoint "charges"
      | url                         | headers                |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : ""} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                                                                                      |
      | charges | status                | es igual a   | 401                                                                                                                        |
      | charges | body.object           | es igual a   | error                                                                                                                      |
      | charges | body.type             | que contiene | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a   | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a   | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP011 - API [CONSULTAR-CARGO] | Con llave privada (sk) no activa.
    Cuando una petición GET es enviada al endpoint "charges"
      | url                         | headers                                         |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : "#MERCHANT_SK_DEACTIVATED#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                                                                                      |
      | charges | status                | es igual a   | 401                                                                                                                        |
      | charges | body.object           | es igual a   | error                                                                                                                      |
      | charges | body.type             | que contiene | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a   | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a   | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP012 - API [CONSULTAR-CARGO] | Con filtro qs incorrecto (amount = 400)
    Cuando una petición GET es enviada al endpoint "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición GET es enviada al endpoint "charges"
      | url                    | qs              |
      | #BASE_URL#/#CHARGE_ID# | {"amount": 400} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP013 - API [CONSULTAR-CARGO] | Con filtro qs incorrecto (amoooount = 300)
    Cuando una petición GET es enviada al endpoint "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición GET es enviada al endpoint "charges"
      | url                    | qs                 |
      | #BASE_URL#/#CHARGE_ID# | {"amoooount": 300} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP014 - [UnHappy] API [CONSULTAR-CARGO] |  con Header Authorization (Requerido) [Inexistente] [401]
    Cuando una petición GET es enviada al endpoint "charges"
      | url                                  | headers                 |
      | #BASE_URL#/chr_live_eBO0R2hvy4yWSbqn | {"Authorization": null} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                      |
      | charges | status                | es igual a | 401                                                                                                                        |
      | charges | body.object           | es igual a | error                                                                                                                      |
      | charges | body.type             | es igual a | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP015 - [UnHappy] API [CONSULTAR-CARGO] |  con Header Authorization (Requerido) [Inválido 'Bearer sk_pkxd_2dce7111f95xMATT'] [500]
    Cuando una petición GET es enviada al endpoint "charges"
      | url                                  | headers                                              |
      | #BASE_URL#/chr_live_eBO0R2hvy4yWSbqn | {"Authorization": "Bearer sk_pkxd_2dce7111f95xMATT"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                      |
      | charges | status                | es igual a | 401                                                                                                                        |
      | charges | body.object           | es igual a | error                                                                                                                      |
      | charges | body.type             | es igual a | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP016 - [UnHappy] API [CONSULTAR-CARGO] |  con Path Id (Requerido) [Valor (String) Mayor a 25 caracteres] [401]
    Cuando una petición GET es enviada al endpoint "charges"
      | url                                   |
      | #BASE_URL#/chr_live_eBO0R2hvy4yWSbqn1 |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP017 - [UnHappy] API [CONSULTAR-CARGO] |  con Path Id (Requerido) [Valor (String) Menor a 25 caracteres] [400]
    Cuando una petición GET es enviada al endpoint "charges"
      | url                                 |
      | #BASE_URL#/chr_live_eBO0R2hvy4yWSbq |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP018 - [UnHappy] API [CONSULTAR-CARGO] |  con Path Id (Requerido) [Formato Erroneo - Valor (String) 'xxyz_xrsz_sdsdsdsds'] [400]
    Cuando una petición GET es enviada al endpoint "charges"
      | url                            |
      | #BASE_URL#/xxyz_xrsz_sdsdsdsds |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |
