# language: es

Característica: CULQI API | Suite 001: Pruebas del métodos [POST] - [CREAR CARGOS] con [TOKENS]
  Más información viste: https://apidocs.culqi.com/#tag/Charges


  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "charges"
    Dado los datos de la tarjeta "VISA"
    Dado un correo temporal

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

  Escenario: CP002 - [Unhappy] API [CREAR-CARGO] | Con un monto (amount) menor del mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body            |
      | {"amount":"1" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP003 - [Unhappy] API [CREAR-CARGO] | Con un monto (amount) mayor del máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                       |
      | {"amount":"999999999999" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                              |
      | charges | status                | es igual a | 400                                                                                                |
      | charges | body.object           | es igual a | error                                                                                              |
      | charges | body.merchant_message | es igual a | El campo 'amount' es inválido.  El valor de 'amount' debe ser de no más de 9999900 (S/ 99,999.00). |

  Escenario: CP004 - [Unhappy] API [CREAR-CARGO] | Con un código de moneda (currency_code) inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                     |
      | {"currency_code":"XYZ" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                             |
      | charges | status                | es igual a   | 400                                               |
      | charges | body.merchant_message | que contiene | El campo 'currency_code' es inválido o está vacío |

  Escenario: CP005 - [Unhappy] API [CREAR-CARGO] | Con un correo electrónico (email) inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                             |
      | {"email":"123.invalid_mail.xyz"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                      |
      | charges | status                | es igual a   | 400                                        |
      | charges | body.merchant_message | que contiene | El campo 'email' es inválido o está vacío. |

  Escenario: CP006 - [Unhappy] API [CREAR-CARGO] | Con un id de token (source_id) inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                    |
      | {"source_id":"#TOKEN_ID_ENV_INVALID#" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                     |
      | charges | status                | es igual a   | 400                                                       |
      | charges | body.merchant_message | que contiene | El campo 'source_id' tiene un valor inexistente en Culqi. |

  Escenario: CP007 - [Unhappy] API [CREAR-CARGO] | Con un valor de captura (capture) inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                |
      | {"capture":"null" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                        |
      | charges | status                | es igual a   | 400                                          |
      | charges | body.merchant_message | que contiene | El campo 'capture' es inválido o está vacío. |

  Escenario: CP008 - [Unhappy] API [CREAR-CARGO] | Con una descripción (description) cuya cantidad de caracteres es menor del mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                    |
      | { "description":"abc" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                             |
      | charges | status                | es igual a   | 400                                               |
      | charges | body.merchant_message | que contiene | El campo 'description' no tiene un formato válido |

  Escenario: CP009 - [Unhappy] API [CREAR-CARGO] | Con una descripción (description) cuya cantidad de caracteres es mayor del máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                   |
      | {"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lacinia purus ac aliquam ultrices." } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                             |
      | charges | status                | es igual a   | 400                                               |
      | charges | body.merchant_message | que contiene | El campo 'description' no tiene un formato válido |

  Escenario: CP010 - [Happy] API [CREAR-CARGO] | Con una cantidad de cuotas (installments) menor del mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                   |
      | {"installments":"-1" } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition  | value |
      | charges | status     | es igual a | 201   |


  #TODO: - Falla en TEST (Reportar)
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

  Escenario: CP012 - [Happy] API [CREAR-CARGO] | Con un objeto metadata vacío.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body            |
      | {"metadata":{}} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"

  Escenario: CP013 - [Happy] API [CREAR-CARGO] | Con metadata cuyos atributos tienen valores vacíos.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                            |
      | { "metadata":{"last_name":""} } |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"

  Escenario: CP014 - [Happy] API [CREAR-CARGO] | Con metadata cuyos atributos/valores son variables pero validos.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                      |
      | { "metadata":{"first_name":"jesus","last_name":"Perez"} } |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"

  Escenario: CP015 - [Unhappy] API [CREAR-CARGO] | Con metadata cuya cantidad de atributos es superior al máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
      | {"metadata":{"cliente_id":"test","documento_identidad":"test","last_name":"test","device_type":"test","device_id":"test","device_os":"test","device_os_version":"test","device_model":"test","device_manufacturer":"test","device_brand":"test","device_ip":"test","device_mac":"test","device_serial":"test","device_uuid":"test","device_name":"test","device_version":"test","device_locale":"test","device_language":"test","device_country":"test","device_timezone":"test","device_carrier":"test","device_connection":"test","device_wifi":"test"}} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                          |
      | charges | status                | es igual a   | 400                                                            |
      | charges | body.merchant_message | que contiene | Enviaste más de 20 parámetros en el metadata. El limite es 20. |

  Escenario: CP016 - [Unhappy] API [CREAR-CARGO] | Con metadata cuyos valor de atributos excede el tamaño máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                    |
      | {"metadata":{"last_name":"EKJXBU4VQILVVTU93KG1FMBZETUFKVQWYEXD0FYY4XON971NWHVBWWEPT8XJGWRUDCL3YVKMYYQFGXSSXZU1AUZK9LX6FL70ZTK1UGU66DN5L4MIO0C9MCDSJDI806CPJW2Q7K3SSVY39340W00545V5QUP5WOOF0FQ46CTOSO5D8FYTI0OGSXAY7AJXY7KB425SPWDHS1T2RVVZDDQYWY2JN7T79EII7VCTSOCQHAXUPE7VENA3YIGVAN"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP017 - [Unhappy] API [CREAR-CARGO] | Con metadata cuyos identificadores de llaves exceden el tamaño máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                     |
      | {"metadata":{"foodssssssssssssssssssssssssssss":"test"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP018 - [Unhappy] API [CREAR-CARGO] | Con dirección en detalles de antifraude con un tamaño menor al mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                  |
      | {"antifraud_details":{"address":"a"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP019 - [Unhappy] API [CREAR-CARGO] | Con dirección en detalles de antifraude con un tamaño mayor al máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                           |
      | {"antifraud_details":{"address":"EKJXBU4VQILVVTU93KG1FMBZETUFKVQWYEXD0FYY4XON971NWHVBWWEPT8XJGWRUDCL3YVKMYYQFGXSSXZU1AUZK9LX6FL70ZTK1UGU66DN5L4MIO0C9MCDSJDI806CPJW2Q7K3SSVY39340W00545V5QUP5WOOF0FQ46CTOSO5D8FYTI0OGSXAY7AJXY7KB425SPWDHS1T2RVVZDDQYWY2JN7T79EII7VCTSOCQHAXUPE7VENA3YIGVAN"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP020 - [Unhappy] API [CREAR-CARGO] | Con ciudad de la dirección en detalles de antifraude con un tamaño menor al mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                       |
      | {"antifraud_details":{"address_city":"a"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP021 - [Unhappy] API [CREAR-CARGO] | Con ciudad de la dirección en detalles de antifraude con un tamaño mayor al máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                                |
      | {"antifraud_details":{"address_city":"EKJXBU4VQILVVTU93KG1FMBZETUFKVQWYEXD0FYY4XON971NWHVBWWEPT8XJGWRUDCL3YVKMYYQFGXSSXZU1AUZK9LX6FL70ZTK1UGU66DN5L4MIO0C9MCDSJDI806CPJW2Q7K3SSVY39340W00545V5QUP5WOOF0FQ46CTOSO5D8FYTI0OGSXAY7AJXY7KB425SPWDHS1T2RVVZDDQYWY2JN7T79EII7VCTSOCQHAXUPE7VENA3YIGVAN"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP022 - [Unhappy] API [CREAR-CARGO] | Con código de país inválido en detalles de antifraude.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                         |
      | {"antifraud_details":{"country_code":"abc"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP023 - [Unhappy] API [CREAR-CARGO] | Con nombres en detalles de antifraude con un tamaño menor al mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                     |
      | {"antifraud_details":{"first_name":"a"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP024 - [Unhappy] API [CREAR-CARGO] | Con nombres en detalles de antifraude con un tamaño mayor al máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                              |
      | {"antifraud_details":{"first_name":"EKJXBU4VQILVVTU93KG1FMBZETUFKVQWYEXD0FYY4XON971NWHVBWWEPT8XJGWRUDCL3YVKMYYQFGXSSXZU1AUZK9LX6FL70ZTK1UGU66DN5L4MIO0C9MCDSJDI806CPJW2Q7K3SSVY39340W00545V5QUP5WOOF0FQ46CTOSO5D8FYTI0OGSXAY7AJXY7KB425SPWDHS1T2RVVZDDQYWY2JN7T79EII7VCTSOCQHAXUPE7VENA3YIGVAN"}} |
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

  Escenario: CP026 - [Unhappy] API [CREAR-CARGO] | Con apellidos en detalles de antifraude con un tamaño mayor al máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                             |
      | {"antifraud_details":{"last_name":"EKJXBU4VQILVVTU93KG1FMBZETUFKVQWYEXD0FYY4XON971NWHVBWWEPT8XJGWRUDCL3YVKMYYQFGXSSXZU1AUZK9LX6FL70ZTK1UGU66DN5L4MIO0C9MCDSJDI806CPJW2Q7K3SSVY39340W00545V5QUP5WOOF0FQ46CTOSO5D8FYTI0OGSXAY7AJXY7KB425SPWDHS1T2RVVZDDQYWY2JN7T79EII7VCTSOCQHAXUPE7VENA3YIGVAN"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP027 - [Unhappy] API [CREAR-CARGO] | Con número de teléfono en detalles de antifraude con un tamaño menor al mínimo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                       |
      | {"antifraud_details":{"phone_number":"0"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP028 - [Unhappy] API [CREAR-CARGO] | Con número de teléfono en detalles de antifraude con un tamaño mayor al máximo permitido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                          |
      | {"antifraud_details":{"phone_number":"51924142670670241429"}} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP029 - [Unhappy] API [CREAR-CARGO] | Con un correo electronico que se encuentra en la lista negra de Culqi.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                |
      | {"email":"#EMAIL_BLACKLIST_CULQI#"} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP030 - [Unhappy] API [CREAR-CARGO] | Con un correo electronico que se encuentra en la lista negra del merchant.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                   |
      | {"email":"#EMAIL_BLACKLIST_MERCHANT#"} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP031 - [Happy] API [CREAR-CARGO] | Con endpoint inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Cuando una petición POST es enviada al endpoint "charges"
      | url          |
      | #SECURE_URL# |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "403"

  Escenario: CP032 - [Happy] API [CREAR-CARGO] | Con código de comercio (llave pública - pk).
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                            |
      | {"Authorization": "#VALIDATE_PK#"} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP033 - [Happy] API [CREAR-CARGO] | Con llave privada (sk) no activa.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                                        |
      | {"Authorization": "#MERCHANT_SK_DEACTIVATED#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                           |
      | charges | status                | es igual a   | 401                                             |
      | charges | body.merchant_message | que contiene | La llave de autenticación enviada no es válida. |

  Escenario: CP034 - [Happy] API [CREAR-CARGO] | Con llave privada (sk) inválida.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                                    |
      | {"Authorization": "#MERCHANT_SK_INVALID#"} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP035 - [Happy] API [CREAR-CARGO] | Con llave privada (sk) que referencia aun entorno el cual no existe.
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                                             |
      | {"Authorization": "#MERCHANT_SK_NON_EXISTING_ENV#"} |
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP036 - [Happy] API [CREAR-CARGO] | Con un valor de captura (capture = false).
    Cuando una petición POST es enviada al endpoint "tokens"
      | body                              |
      | {"fingerprint": "wilsondevlive" } |
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                |
      | {"capture": false } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                         | condition                       | value                                                 |
      | charges | status                             | es igual a                      | 201                                                   |
      | charges | body.id                            | que inicia con                  | chr_                                                  |
      | charges | body.object                        | es igual a                      | charge                                                |
      | charges | body.id                            | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.reference_code                | que cumple con la condicion de  | #REFERENCE_CODE#                                      |
      | charges | body.amount                        | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded               | es igual a                      | 0                                                     |
      | charges | body.current_amount                | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments                  | es igual a                      | 0                                                     |
#      | charges | body.installments_amount           | que es nulo                     | null                                                  |
      | charges | body.currency_code                 | es igual a                      | PEN                                                   |
      | charges | body.description                   | que es nulo                     | null                                                  |
      | charges | body.source                        | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object                 | es igual a                      | token                                                 |
      | charges | body.source.id                     | es igual a                      | #TOKEN_ID#                                            |
      | charges | body.source.type                   | es igual a                      | card                                                  |
      | charges | body.source.active                 | es un booleano                  | boolean                                               |
      | charges | body.source.iin                    | que es una propiedad anidada de | body.source                                           |
      | charges | body.source.iin.object             | es igual a                      | iin                                                   |
      | charges | body.source.iin.card_brand         | es igual a                      | #CARD_BRAND#                                          |
#      | charges | body.source.iin.card_category      | que es nulo                     | null                                                  |
      | charges | body.source.client.ip_country      | tiene uno de                    | ["Peru", "United States of America"]                  |
      | charges | body.source.client.ip_country_code | tiene uno de                    | ["PE", "US"]                                          |
      | charges | body.outcome.type                  | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code                  | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message      | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message          | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                       | es un booleano                  | boolean                                               |
      | charges | body.capture                       | es un booleano                  | boolean                                               |
      | charges | body.duplicated                    | es un booleano                  | boolean                                               |
      | charges | body.paid                          | es un booleano                  | boolean                                               |
      | charges | body.transfer_id                   | que es nulo                     | null                                                  |

  Escenario: CP037 - [Unhappy] API [CREAR-CARGO] | Con un valor de captura (capture) inválido.
    Cuando una petición POST es enviada al endpoint "tokens"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                  |
      | {"capture": "abcde" } |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                       |
      | charges | status                | es igual a | 400                                                                                                         |
      | charges | body.merchant_message | es igual a | El campo 'capture' es inválido o está vacío. Los valores permitidos son de tipo booleano: 'true' o 'false'. |
      | charges | body.type             | es igual a | parameter_error                                                                                             |
      | charges | body.param            | es igual a | capture                                                                                                     |

  # -------------- CULQI2 -----------------#

  Escenario: CP038 - [Happy] API [CREAR-CARGO] | con Header Authorization [Válido] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP039 - [Happy] API [CREAR-CARGO] | con Header Content-type (Requerido) [Válido 'application/json'] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                              |
      | {"Content-Type": "application/json"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  @skip-qa-test
  Escenario: CP040 - [Happy] API [CREAR-CARGO] | con Body amount (Requerido) [Valor (Integer) igual a 9999899] Limite maximo [401]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                 |
      | {"amount": "999899"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition    | value          |
      | charges | status     | tiene uno de | ["200", "201"] |

  Escenario: CP041 - [Happy] API [CREAR-CARGO] | con Body amount (Requerido) [Valor (Integer) igual a 100] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"amount": "100"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP042 - [Happy] API [CREAR-CARGO] | con Body currency_code (Requerido) [Campo Existente - Valor (String) (PEN) - ISO 4217] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                     |
      | {"currency_code": "PEN"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  @skip #NO SE TIENE CONFIGURADO EL COMERCIO SANDBOX para usar la moneda USD.
  Escenario: CP043 - [Happy] API [CREAR-CARGO] | con Body currency_code (Requerido) [Campo Existente - Valor (String) (USD) - ISO 4217] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                     |
      | {"currency_code": "USD"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  @skip
  Escenario: CP044 - [Happy] API [CREAR-CARGO] | con Body email (Requerido) [Campo Existente - Valor (String) igual a 5 caracteres 'c@c.c'] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body               |
      | {"email": "c@c.c"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  @skip
  Escenario: CP045 - [Happy] API [CREAR-CARGO] | con Body email (Requerido) [Campo Existente - Valor (String) igual a 50 caracteres  'pedropablitoperezdelossantosrivaguero123@culqi.com'] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                            |
      | {"email": "pedropablitoperezdelossantosrivaguero123@culqi.com"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  @only-QA @skype #Moneda inactiva o no permitida - En el comercio de Sandbox.
  Escenario: CP046 - [Happy] API [CREAR-CARGO] | con Body source_id (Requerido) [Campo Existente - Valor (String) igual a 25 caracteres 'ype_live_0CjjdWhFpEAZlxlz'] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
      | headers                      | body                                                             | exclude                                                                         | url             |
      | {"Activate-Mock-Yape": true} | {"otp": "268642", "number_phone": "900000001", "amount": "3000"} | {"body":["card_number", "cvv", "expiration_month", "expiration_year", "email"]} | #BASE_URL#/yape |
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body               | headers                        |
      | {"amount": "3000"} | {"Activate-Mock-Charge": true} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP047 - [Happy] API [CREAR-CARGO] | con Body capture, description, installments, metadata, antifraud_details. authentication_3DS (Opcional) [Campo Inexistente] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | exclude              |
      | {"body":["capture"]} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP048 - [Happy] API [CREAR-CARGO] | con Body capture (Opcional) [Campo Existente - Valor (Boolean) (true)] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"capture": true} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP049 - [Happy] API [CREAR-CARGO] | con Body capture (Opcional) [Campo Existente - Valor (Boolean) (false)] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body               |
      | {"capture": false} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP050 - [Happy] API [CREAR-CARGO] | con Body description (Opcional) [Valor (String) igual a 80 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                |
      | {"description": "que es una propiedad anidada deque es una propiedad anidada defsdfsdfdsfdsfdsfgg"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP051 - [Happy] API [CREAR-CARGO] | con Body description (Opcional) [Valor (String) igual a 5 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                     |
      | {"description": "quees"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP052 - [Happy] API [CREAR-CARGO] | con Body installments (Opcional) [Campo Existente - Valor Permitido (Sring) (2)] [201]
    Dado los datos de la tarjeta "MASTERCARD"
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                  |
      | {"installments": "2"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP053 - [Happy] API [CREAR-CARGO] | con Body metadata (Opcional) [Campo Existente] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                |
      | {"metadata": {"Case2": "Prueba2" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP054 - [Happy] API [CREAR-CARGO] | con Body metadata (Opcional) [Igual a 20 objetos] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
      | { "metadata": {  "objeto_1": "123456-1", "objeto_2": "123456-2", "objeto_3": "123456-3", "objeto_4": "123456-4", "objeto_5": "123456-5", "objeto_6": "123456-6", "objeto_7": "123456-7", "objeto_8": "123456-8", "objeto_9": "123456-9", "objeto_10": "123456-10", "objeto_11": "123456-11", "objeto_12": "123456-12", "objeto_13": "123456-13", "objeto_14": "123456-14", "objeto_15": "123456-15", "objeto_16": "123456-16", "objeto_17": "123456-17", "objeto_18": "123456-18", "objeto_19": "123456-19", "objeto_20": "123456-20" } } |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP055 - [Happy] API [CREAR-CARGO] | con Body metadata.object.key (Opcional) [Valor (String) igual a 30 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                         |
      | {"metadata": {"objeto_10000000000000000000000": "Prueba2" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP056 - [Happy] API [CREAR-CARGO] | con Body metadata.object.value (Opcional) [Valor (String) igual a 200 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                          |
      | {"metadata": {"objeto_10000000000000000000000": "1234564323456543234567643wertyewqwertywqwertyu1234567uhgfdsawertyy543234r5tgvcdsawertghgfdsw345tyhgvcdswer5t6yhbvfdew3456787654wfgfdswertyhgfdswertgfdsdfvfrew345t6543wefgt54wfr432ertgfdswertyt54wq23er" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP057 - [Happy] API [CREAR-CARGO] | con Body antifraud_details (Opcional) [Campo Existente] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                            |
      | {"antifraud_details": {"address": "Avenida Lima 1234", "address_city": "Lima", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP058 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.address (Opcional) [Valor (String) igual a 100 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                               |
      | {"antifraud_details": {"address": "Avenida Lima 1234 Avenida Lima 1234 Avenida Lima 1234 Avenida Lima 1234 Avenida Lima 1234 Avenida Li", "address_city": "Lima", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP059 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.address (Opcional) [Valor (String) igual a 5 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                |
      | {"antifraud_details": {"address": "nidad", "address_city": "Lima", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP060 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.address_city (Opcional) [Valor (String) igual a 30 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                          |
      | {"antifraud_details": {"address": "nidad", "address_city": "LimaLimaLimaLimaLimaLimaLimaff", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP061 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.address_city (Opcional) [Valor (String) igual a 2 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                              |
      | {"antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP062 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.country_code (Opcional) [Campo Existente - Valor (String) (PE) - ISO-3166-1 (Alfa 2)] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                              |
      | {"antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP063 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.first_name (Opcional) [Valor (String) igual a 50 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                           |
      | {"antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "culqiculqiculqiculqiculqiculqiculqiculqiculqiculqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP064 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.first_name (Opcional) [Valor (String) igual a 2 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                       |
      | {"email":"accept@culqi.com", "antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "cu", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP065 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.last_name (Opcional) [Valor (String) igual a 50 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                         |
      | {"antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "cu", "last_name": "culqiculqiculqiculqiculqiculqiculqiculqiculqiculqi", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP066 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.last_name (Opcional) [Valor (String) igual a 2 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                         |
      | {"antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "cu", "last_name": "cu", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP067 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.phone_number (Opcional) [Valor (String) igual a 15 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                               |
      | {"antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "cu", "last_name": "cu", "phone_number": "999777666012345" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP068 - [Happy] API [CREAR-CARGO] | con Body antifraud_details.phone_number (Opcional) [Valor (String) igual a 5 caracteres] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                 |
      | {"email":"accept@culqi.com", "antifraud_details": {"address": "nidad", "address_city": "Li", "country_code": "PE", "first_name": "cu", "last_name": "cu", "phone_number": "99977" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |

  Escenario: CP069 - [Happy] API [CREAR-CARGO] | con Body authentication_3DS (Opcional) [Campo Existente] [201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                     |
      | {"authentication_3DS": {"directoryServerTransactionId": 12312312313131, "eci": "05", "protocolVersion": "2.2.0", "xid": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTA="}} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                       | value    |
      | charges | status     | es igual a                      | 201      |
      | charges | body.id    | que es una propiedad anidada de | response |
  
  # (201 en Test, 400 en Live)
  Escenario: CP070 - [Happy] API [CREAR-CARGO] | con Body authentication_3DS.key.value [xid, cavv, directoryServerTransactionId, eci, protocolVersion] (Opcional) [Campo Existente - Valor (String)] [ 404, 201]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                             |
      | {"authentication_3DS": {"cavv": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTA=", "directoryServerTransactionId": 12312312313131, "eci": "05", "protocolVersion": "2.2.0", "xid": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTA="}} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition    | value          |
      | charges | status     | tiene uno de | ["400", "201"] | 

  Escenario: CP071 - [UnHappy] API [CREAR-CARGO] | con Header Authorization (Requerido) [Inexistente] [401]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                                               |
      | {"Authorization": "Bearer pk_live_bf0ef98V5NOEXISTE"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                      |
      | charges | status                | es igual a | 401                                                                                                                        |
      | charges | body.object           | es igual a | error                                                                                                                      |
      | charges | body.type             | es igual a | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP072 - [UnHappy] API [CREAR-CARGO] | con Header Authorization (Requerido) [Inválido 'Bearer sk_pkxd_2dce7111f95xMATT'] [401]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                                              |
      | {"Authorization": "Bearer sk_pkxd_2dce7111f95xMATT"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                      |
      | charges | status                | es igual a | 401                                                                                                                        |
      | charges | body.object           | es igual a | error                                                                                                                      |
      | charges | body.type             | es igual a | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP073 - [UnHappy] API [CREAR-CARGO] | con Header Content-type (Requerido) [Inexistente] [415]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                |
      | {"Content-Type": null} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                           |
      | charges | status                | es igual a | 415                                                                                                             |
      | charges | body.object           | es igual a | error                                                                                                           |
      | charges | body.type             | es igual a | invalid_request_error                                                                                           |
      | charges | body.merchant_message | es igual a | Petición inválida, verifica que el Content-Type sea application/json (formato JSON) y el cuerpo un JSON válido. |

  Escenario: CP074 - [UnHappy] API [CREAR-CARGO] | con Header Content-type (Requerido) [Inválido 'application'] [415]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | headers                         |
      | {"Content-Type": "application"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                           |
      | charges | status                | es igual a | 415                                                                                                             |
      | charges | body.object           | es igual a | error                                                                                                           |
      | charges | body.type             | es igual a | invalid_request_error                                                                                           |
      | charges | body.merchant_message | es igual a | Petición inválida, verifica que el Content-Type sea application/json (formato JSON) y el cuerpo un JSON válido. |

  Escenario: CP075 - [UnHappy] API [CREAR-CARGO] | con Body amount (Requerido) [Campo Inexistente] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | exclude                                                               |
      | {"body":["amount", "currency_code", "email", "source_id", "capture"]} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  @skip-qa-test
  Escenario: CP076 - [UnHappy] API [CREAR-CARGO] | con Body amount (Requerido) [Valor (Integer) Mayor a 999900] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                 |
      | {"amount": "999901"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                            |
      | charges | status                | es igual a | 400                                              |
      | charges | body.object           | es igual a | error                                            |
      | charges | body.type             | es igual a | operacion_denegada                               |
      | charges | body.code             | es igual a | CULQ0001                                         |
      | charges | body.decline_code     | es igual a | exceeded_limit_PEN                               |
      | charges | body.merchant_message | es igual a | Monto supera el límite conﬁgurado                |
      | charges | body.user_message     | es igual a | Superó el monto máximo aceptado por el comercio. |

  Escenario: CP077 - [UnHappy] API [CREAR-CARGO] | con Body amount (Requerido) [Valor (Integer) Menor a 100] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body             |
      | {"amount": "99"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters        | condition  | value                                                                            |
      | charges | status            | es igual a | 400                                                                              |
      | charges | body.object       | es igual a | error                                                                            |
      | charges | body.type         | es igual a | parameter_error                                                                  |
      | charges | body.user_message | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte. |

  Escenario: CP078 - [UnHappy] API [CREAR-CARGO] | con Body amount (Requerido) [Valor (Integer) igual a 0] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body            |
      | {"amount": "0"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters        | condition  | value                                                                            |
      | charges | status            | es igual a | 400                                                                              |
      | charges | body.object       | es igual a | error                                                                            |
      | charges | body.type         | es igual a | parameter_error                                                                  |
      | charges | body.user_message | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte. |

  Escenario: CP079 - [UnHappy] API [CREAR-CARGO] | con Body amount (Requerido) [Valor (Integer) negativo] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body               |
      | {"amount": "-100"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                    |
      | charges | status                | es igual a | 400                                                                                                                      |
      | charges | body.object           | es igual a | error                                                                                                                    |
      | charges | body.type             | es igual a | parameter_error                                                                                                          |
      | charges | body.merchant_message | es igual a | El campo 'amount' es inválido o está vacío.  El valor debe ser entero y sin punto decimal. Ejemplo: 19900 (199.00 soles) |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                         |

  Escenario: CP080 - [UnHappy] API [CREAR-CARGO] | con Body amount (Requerido) [Formato Erroneo - Valor (String) letras 'xyz'] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"amount": "xyz"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                    |
      | charges | status                | es igual a | 400                                                                                                                      |
      | charges | body.object           | es igual a | error                                                                                                                    |
      | charges | body.type             | es igual a | parameter_error                                                                                                          |
      | charges | body.merchant_message | es igual a | El campo 'amount' es inválido o está vacío.  El valor debe ser entero y sin punto decimal. Ejemplo: 19900 (199.00 soles) |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                         |

  Escenario: CP081 - [UnHappy] API [CREAR-CARGO] | con Body currency_code (Requerido) [Campo Inexistente] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                    |
      | {"currency_code": null} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                       |
      | charges | status                | es igual a | 400                                                                                                                                                                         |
      | charges | body.object           | es igual a | error                                                                                                                                                                       |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                             |
      | charges | body.merchant_message | es igual a | El campo 'currency_code' es inválido o está vacío, el código de la moneda en tres letras (Formato ISO 4217). Culqi actualmente soporta las siguientes monedas: 'USD', PEN'. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                            |

  Escenario: CP082 - [UnHappy] API [CREAR-CARGO] | con Body currency_code (Requerido) [Formato Erroneo - Valor (Integer) numeros 123456789] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                         |
      | {"currency_code": 123456789} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                       |
      | charges | status                | es igual a | 400                                                                                                                                                                         |
      | charges | body.object           | es igual a | error                                                                                                                                                                       |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                             |
      | charges | body.merchant_message | es igual a | El campo 'currency_code' es inválido o está vacío, el código de la moneda en tres letras (Formato ISO 4217). Culqi actualmente soporta las siguientes monedas: 'USD', PEN'. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                            |

  Escenario: CP083 - [UnHappy] API [CREAR-CARGO] | con Body currency_code (Requerido) [Valor Inexistente (String) (SOL)] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                     |
      | {"currency_code": "SOL"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                       |
      | charges | status                | es igual a | 400                                                                                                                                                                         |
      | charges | body.object           | es igual a | error                                                                                                                                                                       |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                             |
      | charges | body.merchant_message | es igual a | El campo 'currency_code' es inválido o está vacío, el código de la moneda en tres letras (Formato ISO 4217). Culqi actualmente soporta las siguientes monedas: 'USD', PEN'. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                            |

  Escenario: CP084 - [UnHappy] API [CREAR-CARGO] | con Body email (Requerido) [Campo Inexistente] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body            |
      | {"email": null} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  Escenario: CP085 - [UnHappy] API [CREAR-CARGO] | con Body email (Requerido) [Valor (String) Vacío ] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body           |
      | {"email": " "} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  Escenario: CP086 - [UnHappy] API [CREAR-CARGO] | con Body email (Requerido) [Formato Erroneo - Valor (Integer) numeros 123456789] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                 |
      | {"email": 123456789} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  Escenario: CP087 - [UnHappy] API [CREAR-CARGO] | con Body email (Requerido) [Formato Erroneo - Valor (String) 'x@xyz'] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"email": "x@xy"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  Escenario: CP088 - [UnHappy] API [CREAR-CARGO] | con Body email (Requerido) [Valor (String) Mayor a 50 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                             |
      | {"email": "pedropablitoperezde1111111234567890123456@culqi.com"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  Escenario: CP089 - [UnHappy] API [CREAR-CARGO] | con Body email (Requerido) [Valor (String) Menor a 5 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body              |
      | {"email": "a@c."} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'email' es inválido o está vacío. El valor debe tener un formato válido de email y ser existente. Revisar la referencia del API en https://www.culqi.com/api. |

  Escenario: CP090 - [UnHappy] API [CREAR-CARGO] | con Body source_id (Requerido) [Valor (String) Mayor a 25 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                        |
      | {"source_id": "tkn_live_82s3PtfU3xg6R4Ui1"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                     |
      | charges | status                | es igual a | 400                                                       |
      | charges | body.object           | es igual a | error                                                     |
      | charges | body.type             | es igual a | parameter_error                                           |
      | charges | body.merchant_message | es igual a | El campo 'source_id' tiene un valor inexistente en Culqi. |

  Escenario: CP091 - [UnHappy] API [CREAR-CARGO] | con Body source_id (Requerido) [Valor (String) Menor a 25 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                      |
      | {"source_id": "tkn_live_82s3PtfU3xg6R4U"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                     |
      | charges | status                | es igual a | 400                                                       |
      | charges | body.object           | es igual a | error                                                     |
      | charges | body.type             | es igual a | parameter_error                                           |
      | charges | body.merchant_message | es igual a | El campo 'source_id' tiene un valor inexistente en Culqi. |

  Escenario: CP092 - [UnHappy] API [CREAR-CARGO] | con Body source_id (Requerido) [Formato Erroneo - Valor (String) 'xxyz_xrsz_sdsdsdsds'] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                 |
      | {"source_id": "xxyz_xrsz_sdsdsdsds"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                     |
      | charges | status                | es igual a | 400                                                       |
      | charges | body.object           | es igual a | error                                                     |
      | charges | body.type             | es igual a | parameter_error                                           |
      | charges | body.merchant_message | es igual a | El campo 'source_id' tiene un valor inexistente en Culqi. |

  Escenario: CP093 - [UnHappy] API [CREAR-CARGO] | con Body capture (Opcional) [Formato Erroneo - Valor (String) letras 'xyz'] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body               |
      | {"capture": "xyz"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                       |
      | charges | status                | es igual a | 400                                                                                                         |
      | charges | body.object           | es igual a | error                                                                                                       |
      | charges | body.type             | es igual a | parameter_error                                                                                             |
      | charges | body.merchant_message | es igual a | El campo 'capture' es inválido o está vacío. Los valores permitidos son de tipo booleano: 'true' o 'false'. |

  Escenario: CP094 - [UnHappy] API [CREAR-CARGO] | con Body capture (Opcional) [Formato Erroneo - Valor (Integer) numeros 123456789] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                   |
      | {"capture": 123456789} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                       |
      | charges | status                | es igual a | 400                                                                                                         |
      | charges | body.object           | es igual a | error                                                                                                       |
      | charges | body.type             | es igual a | parameter_error                                                                                             |
      | charges | body.merchant_message | es igual a | El campo 'capture' es inválido o está vacío. Los valores permitidos son de tipo booleano: 'true' o 'false'. |

  Escenario: CP095 - [UnHappy] API [CREAR-CARGO] | con Body description (Opcional) [Valor (String) Mayor a 80 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                 |
      | {"description": "que es una propiedad anidada deque es una propiedad anidada defsdfsdfdsfdsfdsfgg1"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                  |
      | charges | status                | es igual a | 400                                                                                    |
      | charges | body.object           | es igual a | error                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'description' no tiene un formato válido, debe tener entre 5 y 80 caracteres. |

  Escenario: CP096 - [UnHappy] API [CREAR-CARGO] | con Body description (Opcional) [Valor (String) Menor a 5 caracteres 'xyzq'] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                    |
      | {"description": "xyzq"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                  |
      | charges | status                | es igual a | 400                                                                                    |
      | charges | body.object           | es igual a | error                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'description' no tiene un formato válido, debe tener entre 5 y 80 caracteres. |

  Escenario: CP097 - [UnHappy] API [CREAR-CARGO] | con Body installments (Opcional) [Valor Inexistente en Redis - Valor (Sring) (64)] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                   |
      | {"installments": "64"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                         |
      | charges | status                | es igual a | 400                                                                                                                                                           |
      | charges | body.object           | es igual a | error                                                                                                                                                         |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                               |
      | charges | body.merchant_message | es igual a | El campo 'installments' es inválido o está vacío, recordar que el valor debe ser entero positivo. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                              |

  Escenario: CP098 - [Unhappy] API [CREAR-CARGO] | con Body metadata (Opcional) [Mayor a 20 objetos] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
      | {"metadata": {  "objeto_1": "123456-1", "objeto_2": "123456-2", "objeto_3": "123456-3", "objeto_4": "123456-4", "objeto_5": "123456-5", "objeto_6": "123456-6", "objeto_7": "123456-7", "objeto_8": "123456-8", "objeto_9": "123456-9", "objeto_10": "123456-10", "objeto_11": "123456-11", "objeto_12": "123456-12", "objeto_13": "123456-13", "objeto_14": "123456-14", "objeto_15": "123456-15", "objeto_16": "123456-16", "objeto_17": "123456-17", "objeto_18": "123456-18", "objeto_19": "123456-19", "objeto_20": "123456-20", "objeto21": "123456-21" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                          |
      | charges | status                | es igual a | 400                                                            |
      | charges | body.object           | es igual a | error                                                          |
      | charges | body.type             | es igual a | parameter_error                                                |
      | charges | body.merchant_message | es igual a | Enviaste más de 20 parámetros en el metadata. El limite es 20. |

  Escenario: CP099 - [Unhappy] API [CREAR-CARGO] | con Body metadata.object.key (Opcional) [Campo valor mayor a 30 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                           |
      | {"metadata": { "objetocon_maximo_30_caracteres1": "Prueba1" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                               |
      | charges | status                | es igual a | 400                                                                                                                                                                 |
      | charges | body.object           | es igual a | error                                                                                                                                                               |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                     |
      | charges | body.merchant_message | es igual a | El nombre del parametro 'objetocon_maximo_30_caracteres1' de la metadata excede el límite de caracteres. El lÍmite para el nombre de parámetro es de 30 caracteres. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                    |

  Escenario: CP100 - [Unhappy] API [CREAR-CARGO] | con Body metadata.object.value (Opcional) [Valor (String) Mayor a 200 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                            |
      | {"metadata": { "objetocon_maximo_30_caracteres": "1234564323456543234567643wertyewqwertywqwertyu1234567uhgfdsawertyy543234r5tgvcdsawertghgfdsw345tyhgvcdswer5t6yhbvfdew3456787654wfgfdswertyhgfdswertgfdsdfvfrew345t6543wefgt54wfr432ertgfdswertyt54wq23er1" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                     |
      | charges | status                | es igual a | 400                                                                                                                                                       |
      | charges | body.object           | es igual a | error                                                                                                                                                     |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                           |
      | charges | body.param            | es igual a | metadata                                                                                                                                                  |
      | charges | body.merchant_message | es igual a | El valor del parametro 'objetocon_maximo_30_caracteres' de la metadata, su valor excede el límite de caracteres. El limite de valor es de 200 caracteres. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                          |

  Escenario: CP101 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.address (Opcional) [Valor (String) Mayor a 100 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                                                                                |
      | {"antifraud_details": {"address": "Avenida Lima 1234Avenida Lima 1234Avenida Lima 1234Avenida Lima 1234Avenida Lima 1234Avenida Lima 121", "address_city": "Lima", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                              |
      | charges | status                | es igual a | 400                                                                                                                                                                |
      | charges | body.object           | es igual a | error                                                                                                                                                              |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                    |
      | charges | body.merchant_message | es igual a | El campo 'address' es inválido o está vacío. El valor debe ser de menos de 100 caracteres, y más de 5. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                   |

  Escenario: CP102 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.address (Opcional) [Valor (String) Menor a 5 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                               |
      | {"antifraud_details": {"address": "Aven", "address_city": "Lima", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                              |
      | charges | status                | es igual a | 400                                                                                                                                                                |
      | charges | body.object           | es igual a | error                                                                                                                                                              |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                    |
      | charges | body.merchant_message | es igual a | El campo 'address' es inválido o está vacío. El valor debe ser de menos de 100 caracteres, y más de 5. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                   |

  Escenario: CP103 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.address_city (Opcional) [Valor (String) Mayor a 30 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                           |
      | {"antifraud_details": {"address": "Avenf", "address_city": "LimaLimaLimaLimaLimaLimaLimaLim", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'address_city' es inválido o está vacío. El valor debe ser de menos de 30 caracteres, y más de 2. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                       |

  Escenario: CP104 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.address_city (Opcional) [Valor (String) Menor a 2 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                             |
      | {"antifraud_details": {"address": "Avenf", "address_city": "L", "country_code": "PE", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'address_city' es inválido o está vacío. El valor debe ser de menos de 30 caracteres, y más de 2. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                       |

  Escenario: CP105 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.country_code (Opcional) [Valor (String) (PERU)] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                  |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PERU", "first_name": "culqi", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                             |
      | charges | status                | es igual a | 400                                                                                                                                                                               |
      | charges | body.object           | es igual a | error                                                                                                                                                                             |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                                   |
      | charges | body.merchant_message | es igual a | El campo 'country_code' es inválido o está vacío. El valor debe tener el formato ISO-3166-1 (Alfa 2) de 2 caracteres. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                                  |

  Escenario: CP106 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.first_name (Opcional) [Valor (String) Mayor a 50 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                              |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PE", "first_name": "culqiculqiculqiculqiculqiculqiculqiculqiculqiculqim", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                           |
      | charges | status                | es igual a | 400                                                                                                                                             |
      | charges | body.object           | es igual a | error                                                                                                                                           |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                 |
      | charges | body.merchant_message | es igual a | El campo 'first_name' es inválido o está vacío, debe ser de menos de 50 caracteres. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                |

  Escenario: CP107 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.first_name (Opcional) [Valor (String) Menor a 2 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                            |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PE", "first_name": "c", "last_name": "core", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                           |
      | charges | status                | es igual a | 400                                                                                                                                             |
      | charges | body.object           | es igual a | error                                                                                                                                           |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                 |
      | charges | body.merchant_message | es igual a | El campo 'first_name' es inválido o está vacío, debe ser de menos de 50 caracteres. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                |

  Escenario: CP108 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.last_name (Opcional) [Valor (String) Mayor a 50 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                                                               |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PE", "first_name": "cdasd", "last_name": "culqiculqiculqiculqiculqiculqiculqiculqiculqiculqim", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                          |
      | charges | status                | es igual a | 400                                                                                                                                            |
      | charges | body.object           | es igual a | error                                                                                                                                          |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                |
      | charges | body.merchant_message | es igual a | El campo 'last_name' es inválido o está vacío, debe ser de menos de 50 caracteres. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                               |

  Escenario: CP109 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.last_name (Opcional) [Valor (String) Menor a 2 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                             |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PE", "first_name": "cdasd", "last_name": "c", "phone_number": "999777666" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                          |
      | charges | status                | es igual a | 400                                                                                                                                            |
      | charges | body.object           | es igual a | error                                                                                                                                          |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                |
      | charges | body.merchant_message | es igual a | El campo 'last_name' es inválido o está vacío, debe ser de menos de 50 caracteres. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                               |

  Escenario: CP110 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.phone_number (Opcional) [Valor (String) Mayor a 15 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                                        |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PE", "first_name": "cdasd", "last_name": "cdasd", "phone_number": "9997776660123456" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'phone_number' es inválido o está vacío. El valor debe ser de menos de 15 caracteres, y más de 5. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                       |

  Escenario: CP111 - [UnHappy] API [CREAR-CARGO] | con Body antifraud_details.phone_number (Opcional) [Valor (String) Menor a 5 caracteres] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                                                                            |
      | {"antifraud_details": {"address": "Avenf", "address_city": "Lima", "country_code": "PE", "first_name": "cdasd", "last_name": "cdasd", "phone_number": "9997" }} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                                  |
      | charges | status                | es igual a | 400                                                                                                                                                                    |
      | charges | body.object           | es igual a | error                                                                                                                                                                  |
      | charges | body.type             | es igual a | parameter_error                                                                                                                                                        |
      | charges | body.merchant_message | es igual a | El campo 'phone_number' es inválido o está vacío. El valor debe ser de menos de 15 caracteres, y más de 5. Revisar la referencia del API en https://www.culqi.com/api. |
      | charges | body.user_message     | es igual a | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                                                                                       |

  @skip-sbxqa-live @skip
  Escenario: CP112 - [UnHappy] API [CREAR-CARGO] | con Body tarjeta de TEST Rechazada [Valor (decline_code) incorrect_cvv] [400]
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                                   |
      | {"card_number": "5400020000000003", "cvv": "203", "expiration_month": "12", "expiration_year": "2030"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition  | value |
      | charges | status     | es igual a | 400   |

  @skip-qa-test
  Escenario: CP112 - [Happy] API [CREAR-CARGO] | con token de Producto Link [source_id](capture → default | currency → PEN) [201].
    Cuando una petición POST es enviada al endpoint "tokens"
      | headers                                                                        |
      | {"Authorization":"#HEADERS_AUTHORIZATION_PK_LINK#", "x-culqi-product": "link"} |
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                                     | exclude              | headers                                                                                                                      |
      | {"amount":"610", "metadata": {"payment_link": "V8W93JZU0U"}, "phoneNumber": "955722398"} | {"body":["capture"]} | {"Authorization":"#HEADERS_AUTHORIZATION_SK_LINK#", "x-culqi-product": "link", "X-Culqi-Header-Link": "#CULQI_HEADER_LINK#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                    | condition                       | value                                                 |
      | charges | status                        | es igual a                      | 201                                                   |
      | charges | body.id                       | que inicia con                  | chr_                                                  |
      | charges | body.object                   | es igual a                      | charge                                                |
      | charges | body.id                       | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.amount                   | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded          | es igual a                      | 0                                                     |
      | charges | body.current_amount           | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments             | es igual a                      | 0                                                     |
      | charges | body.currency_code            | es igual a                      | PEN                                                   |
      | charges | body.description              | que es nulo                     | null                                                  |
      | charges | body.source                   | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object            | es igual a                      | token                                                 |
      | charges | body.source.id                | es igual a                      | #TOKEN_ID#                                            |
      | charges | body.source.type              | es igual a                      | card                                                  |
      | charges | body.source.iin               | que es una propiedad anidada de | body.source                                           |
      | charges | body.source.iin.object        | es igual a                      | iin                                                   |
      | charges | body.source.iin.card_brand    | es igual a                      | #CARD_BRAND#                                          |
      | charges | body.outcome.type             | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code             | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message     | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                  | es igual a                      | false                                                 |
      | charges | body.capture                  | es igual a                      | true                                                  |
      | charges | body.duplicated               | es igual a                      | false                                                 |
      | charges | body.paid                     | es igual a                      | false                                                 |
      | charges | body.transfer_id              | que es nulo                     | null                                                  |

  @skip-qa-test
  Escenario: CP113 - [Happy] API [CREAR-CARGO] | con token de Producto Link [source_id](capture → FALSE | currency → PEN) [201].
    Cuando una petición POST es enviada al endpoint "tokens"
      | headers                                                                        |
      | {"Authorization":"#HEADERS_AUTHORIZATION_PK_LINK#", "x-culqi-product": "link"} |
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                          | headers                                                                                                                      |
      | {"amount":"610","capture": false, "metadata": {"payment_link": "V8W93JZU0U"}} | {"Authorization":"#HEADERS_AUTHORIZATION_SK_LINK#", "x-culqi-product": "link", "X-Culqi-Header-Link": "#CULQI_HEADER_LINK#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                    | condition                       | value                                                 |
      | charges | status                        | es igual a                      | 201                                                   |
      | charges | body.id                       | que inicia con                  | chr_                                                  |
      | charges | body.object                   | es igual a                      | charge                                                |
      | charges | body.id                       | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.amount                   | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded          | es igual a                      | 0                                                     |
      | charges | body.current_amount           | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments             | es igual a                      | 0                                                     |
      | charges | body.currency_code            | es igual a                      | PEN                                                   |
      | charges | body.description              | que es nulo                     | null                                                  |
      | charges | body.source                   | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object            | es igual a                      | token                                                 |
      | charges | body.source.id                | es igual a                      | #TOKEN_ID#                                            |
      | charges | body.source.type              | es igual a                      | card                                                  |
      | charges | body.source.iin               | que es una propiedad anidada de | body.source                                           |
      | charges | body.source.iin.object        | es igual a                      | iin                                                   |
      | charges | body.source.iin.card_brand    | es igual a                      | #CARD_BRAND#                                          |
      | charges | body.outcome.type             | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code             | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message     | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                  | es igual a                      | false                                                 |
      | charges | body.capture                  | es igual a                      | false                                                 |
      | charges | body.duplicated               | es igual a                      | false                                                 |
      | charges | body.paid                     | es igual a                      | false                                                 |
      | charges | body.transfer_id              | que es nulo                     | null                                                  |

  @skip-qa-test
  Escenario: CP114 - [Happy] API [CREAR-CARGO] | con token de Producto Link [source_id](capture → default | currency → USD) [201].
    Cuando una petición POST es enviada al endpoint "tokens"
      | headers                                                                        |
      | {"Authorization":"#HEADERS_AUTHORIZATION_PK_LINK#", "x-culqi-product": "link"} |
    Cuando se muestre la petición de "tokens"
    Cuando se muestre la respuesta de "tokens"
    Entonces la respuesta en "tokens" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Dado un correo temporal
    Cuando una petición POST es enviada al endpoint "charges"
      | body                                                                               | exclude              | headers                                                                                                                      |
      | {"amount":"300","currency_code":"USD", "metadata": {"payment_link": "V8W93JZU0U"}} | {"body":["capture"]} | {"Authorization":"#HEADERS_AUTHORIZATION_SK_LINK#", "x-culqi-product": "link", "X-Culqi-Header-Link": "#CULQI_HEADER_LINK#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                    | condition                       | value                                                 |
      | charges | status                        | es igual a                      | 201                                                   |
      | charges | body.id                       | que inicia con                  | chr_                                                  |
      | charges | body.object                   | es igual a                      | charge                                                |
      | charges | body.id                       | es igual a                      | #CHARGE_ID#                                           |
      | charges | body.amount                   | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.amount_refunded          | es igual a                      | 0                                                     |
      | charges | body.current_amount           | es igual a                      | #CHARGE_AMOUNT#                                       |
      | charges | body.installments             | es igual a                      | 0                                                     |
      | charges | body.currency_code            | es igual a                      | USD                                                   |
      | charges | body.description              | que es nulo                     | null                                                  |
      | charges | body.source                   | que es una propiedad anidada de | body                                                  |
      | charges | body.source.object            | es igual a                      | token                                                 |
      | charges | body.source.id                | es igual a                      | #TOKEN_ID#                                            |
      | charges | body.source.type              | es igual a                      | card                                                  |
      | charges | body.source.iin               | que es una propiedad anidada de | body.source                                           |
      | charges | body.source.iin.object        | es igual a                      | iin                                                   |
      | charges | body.source.iin.card_brand    | es igual a                      | #CARD_BRAND#                                          |
      | charges | body.outcome.type             | es igual a                      | venta_exitosa                                         |
      | charges | body.outcome.code             | es igual a                      | AUT0000                                               |
      | charges | body.outcome.merchant_message | es igual a                      | La operación de venta ha sido autorizada exitosamente |
      | charges | body.outcome.user_message     | es igual a                      | Su compra ha sido exitosa.                            |
      | charges | body.dispute                  | es igual a                      | false                                                 |
      | charges | body.capture                  | es igual a                      | true                                                  |
      | charges | body.duplicated               | es igual a                      | false                                                 |
      | charges | body.paid                     | es igual a                      | false                                                 |