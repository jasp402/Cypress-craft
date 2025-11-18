Feature: Dynamic Workflow from Visual Testflow

  Escenario: CP001 - [Happy] API [CREAR-CARGO] | con token [source_id] válido (capture por default).
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"amount":"300" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                         | condition                       | value                                                 |
      | charges | status                             | es igual a                      | 201                                                   |
      | charges | body.id                            | que inicia con                  | chr_                                                  |
      | charges | body.object                        | es igual a                      | charge                                                |
      | charges | body.id                            | es igual a                      | #CHARGE_ID#                                           |
      #| charges | body.reference_code                | que cumple con la condicion de  | #REFERENCE_CODE#           |
      | charges | body.amount                        | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded               | es igual a                      | 0                                                     |
      | charges | body.current_amount                | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments                  | es igual a                      | 0                                                     |
#	  | charges | body.installments_amount           | que no es nulo                  | null                       |
      | charges | body.currency_code                 | es igual a                      | PEN                                                   |
      | charges | body.description                   | que es nulo                     | null                                                  |
      | charges | body.source                        | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object                 | es igual a                      | token                                                 |
      | charges | body.source.id                     | es igual a                      | #TOKEN_ID#                                            |
      | charges | body.source.type                   | es igual a                      | card                                                  |
      | charges | body.source.iin                    | que es una propiedad anidada de | body.source                                           |
      | charges | body.source.iin.object             | es igual a                      | iin                                                   |
      | charges | body.source.iin.card_brand         | es igual a                      | #CARD_BRAND#                                          |
#      | charges | body.source.iin.card_category      | que es nulo                     | null                       |
      | charges | body.source.client.ip_country      | tiene uno de                    | ["Peru", "United States of America"]                  |
      | charges | body.source.client.ip_country_code | tiene uno de                    | ["PE", "US"]                                          |
      | charges | body.outcome.type                  | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code                  | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message      | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message          | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                       | es igual a                      | false                                                 |
      | charges | body.capture                       | que es nulo                     | null                                                  |
      | charges | body.duplicated                    | es igual a                      | false                                                 |
      | charges | body.paid                          | es igual a                      | false                                                 |
      | charges | body.transfer_id                   | que es nulo                     | null                                                  |


  Escenario: CP011 - [Happy] API [CREAR-CARGO] | Con una cantidad de cuotas (installments) mayor del máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                             |
      | {"installments":"999999999999" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                               |
      | charges | status                | es igual a   | 400                                 |
      | charges | body.merchant_message | que contiene | El campo 'installments' es inválido |


  Escenario: CP023 - [Unhappy] API [CREAR-CARGO] | Con nombres en detalles de antifraude con un tamaño menor al mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                     |
      | {"antifraud_details":{"first_name":"a"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"


  Escenario: CP025 - [Unhappy] API [CREAR-CARGO] | Con apellidos en detalles de antifraude con un tamaño menor al mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                    |
      | {"antifraud_details":{"last_name":"a"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"


