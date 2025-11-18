# language: es
Característica: CULQI API | Suite 002: Pruebas del métodos [POST] - [CREAR CARGOS] con [TARJETAS]
  More info: https://apidocs.culqi.com/#tag/Cargos/operation/crear-cargo

  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "charges"
    Dado los datos de la tarjeta "VISA"
    Dado un correo temporal

  Escenario: CP001 - API [CREAR-CARGO] | Con un id de tarjeta (source_id) válido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "customers"
    Cuando una petición POST es enviada al endpoint "cards"
    Cuando se muestre la petición de "cards"
    Cuando se muestre la respuesta de "cards"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                        |
      | {"source_id": "#CARD_ID#" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                                | condition                       | value                                                 |
      | charges | status                                    | es igual a                      | 201                                                   |
      | charges | body.id                                   | que inicia con                  | chr_                                                  |
      | charges | body.object                               | es igual a                      | charge                                                |
      | charges | body.id                                   | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.reference_code                       | que cumple con la condicion de  | #REFERENCE_CODE#                                      |
      | charges | body.amount                               | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded                      | es igual a                      | 0                                                     |
      | charges | body.current_amount                       | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments                         | es igual a                      | 0                                                     |
#      | charges | body.installments_amount                  | que es nulo                     | 0                                                  |
      | charges | body.currency_code                        | es igual a                      | PEN                                                   |
      | charges | body.description                          | que es nulo                     | null                                                  |
      | charges | body.source                               | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object                        | es igual a                      | card                                                  |
      | charges | body.source.id                            | es igual a                      | #CARD_ID#                                             |
      | charges | body.source.customer_id                   | es igual a                      | #CUSTOMER_ID#                                         |
      | charges | body.source.source.type                   | es igual a                      | card                                                  |
      | charges | body.source.active                        | es igual a                      | true                                                  |
      | charges | body.source.source.iin                    | que es una propiedad anidada de | body.source.source                                    |
      | charges | body.source.source.iin.object             | es igual a                      | iin                                                   |
      | charges | body.source.source.iin.card_brand         | es igual a                      | #CARD_BRAND#                                          |
      | charges | body.source.source.iin.card_category      | que no es nulo                  | null                                                  |
      | charges | body.source.source.client.ip_country      | tiene uno de                    | ["Peru", "United States of America"]                  |
      | charges | body.source.source.client.ip_country_code | tiene uno de                    | ["PE", "US"]                                          |
      | charges | body.outcome.type                         | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code                         | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message             | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message                 | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                              | es igual a                      | false                                                 |
      | charges | body.capture                              | que es nulo                     | null                                                  |
      | charges | body.duplicated                           | es igual a                      | false                                                 |
#      | charges | body.total_fee                            | es igual a                      | 0                                                     |
#      | charges | body.total_fee_taxes                      | es igual a                      | 0                                                     |
#      | charges | body.transfer_amount                      | es igual a                      | 0                                                     |
      | charges | body.paid                                 | es igual a                      | false                                                 |
#      | charges | body.statement_descriptor                 | que inicia con                  | CULQI                                                 |
      | charges | body.transfer_id                          | que es nulo                     | null                                                  |

  Escenario: CP002 - API [CREAR-CARGO] | Usando fingerprint inválido en tokens y capture false.
    Cuando una petición POST es enviada al endpoint "tokens"
      | body                              |
      | {"fingerprint": "wilsondevlive" } |
    Cuando una petición POST es enviada al endpoint "customers"
    Cuando una petición POST es enviada al endpoint "cards"
    Cuando se muestre la petición de "cards"
    Cuando se muestre la respuesta de "cards"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                          | body                                          |
      | {"X-Charge-Channel":"recurrent"} | {"source_id": "#CARD_ID#", "capture": false } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                                | condition                       | value                                                 |
      | charges | status                                    | es igual a                      | 201                                                   |
      | charges | body.id                                   | que inicia con                  | chr_                                                  |
      | charges | body.object                               | es igual a                      | charge                                                |
      | charges | body.id                                   | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.reference_code                       | que cumple con la condicion de  | #REFERENCE_CODE#                                      |
      | charges | body.amount                               | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded                      | es igual a                      | 0                                                     |
      | charges | body.current_amount                       | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments                         | es igual a                      | 0                                                     |
#	  | charges | body.installments_amount                  | que es nulo                     | null                                                  |
      | charges | body.currency_code                        | es igual a                      | PEN                                                   |
      | charges | body.description                          | que es nulo                     | null                                                  |
      | charges | body.source                               | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object                        | es igual a                      | card                                                  |
      | charges | body.source.id                            | es igual a                      | #CARD_ID#                                             |
      | charges | body.source.customer_id                   | es igual a                      | #CUSTOMER_ID#                                         |
      | charges | body.source.source.type                   | es igual a                      | card                                                  |
      | charges | body.source.active                        | es igual a                      | true                                                  |
      | charges | body.source.source.iin                    | que es una propiedad anidada de | body.source.source                                    |
      | charges | body.source.source.iin.object             | es igual a                      | iin                                                   |
      | charges | body.source.source.iin.card_brand         | es igual a                      | #CARD_BRAND#                                          |
      | charges | body.source.source.iin.card_category      | que no es nulo                  | null                                                  |
      | charges | body.source.source.client.ip_country      | tiene uno de                      | ["Peru", "United States of America"]                |
      | charges | body.source.source.client.ip_country_code | tiene uno de                    | ["PE", "US"]                                          |
      | charges | body.outcome.type                         | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code                         | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message             | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message                 | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                              | es igual a                      | false                                                 |
      | charges | body.capture                              | es igual a                      | false                                                 |
      | charges | body.duplicated                           | es igual a                      | false                                                 |
#      | charges | body.total_fee                            | es igual a                      | 0                                                     |
#      | charges | body.total_fee_taxes                      | es igual a                      | 0                                                     |
#      | charges | body.transfer_amount                      | es igual a                      | 0                                                     |
      | charges | body.paid                                 | es igual a                      | false                                                 |
#      | charges | body.statement_descriptor                 | que inicia con                  | CULQI                                                 |
      | charges | body.transfer_id                          | que es nulo                     | null                                                  |

  Escenario: CP003 - API [CREAR-CARGO] | Con un id de tarjeta (source_id) inválido y capture false.
    Cuando una petición POST es enviada al endpoint "tokens"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                      |
      | {"source_id": "#CARD_ID_ENV_INVALID#", "capture": false } |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition      | value                                                     |
      | charges | status                | es igual a     | 400                                                       |
      | charges | body.merchant_message | que inicia con | El campo 'source_id' tiene un valor inexistente en Culqi. |

  Escenario: CP004 - API [CREAR-CARGO] | Con un id de tarjeta (source_id) inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                    |
      | {"source_id": "#CARD_ID_ENV_INVALID#" } |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition      | value                                                     |
      | charges | status                | es igual a     | 400                                                       |
      | charges | body.merchant_message | que inicia con | El campo 'source_id' tiene un valor inexistente en Culqi. |

  Escenario: CP005 - [Happy] Crear Cargo con Body source_id (Requerido) [Campo Existente - Valor (String) igual a 25 caracteres 'crd_test_TWsfemI22ypplGK6'] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "customers"
    Cuando una petición POST es enviada al endpoint "cards"
    Cuando se muestre la petición de "cards"
    Cuando se muestre la respuesta de "cards"
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                        | body                        |
      | {"Activate-Mock-Charge": true} | {"source_id": "#CARD_ID#" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |