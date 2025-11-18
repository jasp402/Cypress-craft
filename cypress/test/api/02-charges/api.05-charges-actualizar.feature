# language: es
Característica: CULQI API | Suite 005: Pruebas del métodos [PATCH] - [ACTUALIZAR CARGOS]
  Más información viste: https://apidocs.culqi.com/#tag/Cargos/operation/actualizar-cargo

  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "charges"
    Dado los datos de la tarjeta "MASTERCARD"
    Dado un correo temporal

  Escenario: CP001 - API [ACTUALIZAR-CARGO] | Enviar datos correctos
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                    | body                             |
      | #BASE_URL#/#CHARGE_ID# | {"metadata": {"dni":"71702324"}} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters        | condition  | value    |
      | charges | status            | es igual a | 200      |
      | charges | body.metadata.dni | es igual a | 71702324 |

  Escenario: CP002 - API [ACTUALIZAR-CARGO] | Con un charge_id que no existe.
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | body                             |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"metadata": {"dni":"71702324"}} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                       |
      | charges | status                | es igual a   | 400                                         |
      | charges | body.type             | es igual a   | parameter_error                             |
      | charges | body.object           | es igual a   | error                                       |
      | charges | body.merchant_message | que contiene | No existe el cargo que intentas actualizar: |

  Escenario: CP003 - API [ACTUALIZAR-CARGO] | Con un objeto metadata vacío
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                    | body             |
      | #BASE_URL#/#CHARGE_ID# | {"metadata": {}} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                 |
      | charges | status                | es igual a | 400                                                   |
      | charges | body.object           | es igual a | error                                                 |
      | charges | body.param            | es igual a | metadata                                              |
      | charges | body.type             | es igual a | parameter_error                                       |
      | charges | body.merchant_message | es igual a | Enviaste el campo metadata con un formato incorrecto. |

  Escenario: CP004 - API [ACTUALIZAR-CARGO] | Sin enviar el objeto metadata
    Cuando una petición GET es enviada al endpoint "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                    |
      | #BASE_URL#/#CHARGE_ID# |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                 |
      | charges | status                | es igual a | 400                                                   |
      | charges | body.object           | es igual a | error                                                 |
      | charges | body.param            | es igual a | metadata                                              |
      | charges | body.type             | es igual a | parameter_error                                       |
      | charges | body.merchant_message | es igual a | Enviaste el campo metadata con un formato incorrecto. |

  Escenario: CP005 - API [ACTUALIZAR-CARGO] | Con atributos vacios en la metadata (limpiar)
    Cuando una petición POST es enviada al endpoint "tokens"
    Cuando una petición POST es enviada al endpoint "charges"
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                    | body                     |
      | #BASE_URL#/#CHARGE_ID# | {"metadata": {"dni":""}} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters        | condition      | value |
      | charges | status            | es igual a     | 200   |
      | charges | body.metadata     | que no es nulo | null  |
      | charges | body.metadata.dni | es igual a     |       |

  Escenario: CP006 - API [ACTUALIZAR-CARGO] | Con atributos/valores variables pero validos.
    Cuando una petición GET es enviada al endpoint "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                    | body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
      | #BASE_URL#/#CHARGE_ID# | {"metadata": {"atribute_0":"SDOEL3H72KJQJ0M8","atribute_1":"BGO4W6EK","atribute_2":"85P", "atribute_3":"NV3SWTYI965MLR6OOQO8G","atribute_4":"IVZEI2K3YO51PR3LB1HNK41Q","atribute_5":"3Y9SKM1CABOGO6FYFCTC8TEGDVS64","atribute_6":"6","atribute_7":"XT8FVKA","atribute_8":"OWXEGWMLT5YKUDNO00C6P62","atribute_9":"0H7YD82XATNRZ5HKYFP","atribute_10":"HI3KFKYQ2DNS0GA0OCHGPL","atribute_11":"FU6NQKHWAKKKH4C6AX2C8","atribute_12":"UJNHIJOCIFY519S8LBYFMJG","atribute_13":"AH4L4FC60G2MJEUPBSP62T3PE9","atribute_14":"TMW1LTX","atribute_15":"YZZT9XH1I6R6B8EP2ZB3D5T1HRZ","atribute_16":"NEXW1E5TL5XI","atribute_17":"SGWM33XKZULTA18","atribute_18":"80D607TXA6GP8322UT","atribute_19":"NIA0ZXKE" }} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters                | condition  | value                         |
      | charges | status                    | es igual a | 200                           |
      | charges | body.metadata.atribute_0  | es igual a | SDOEL3H72KJQJ0M8              |
      | charges | body.metadata.atribute_1  | es igual a | BGO4W6EK                      |
      | charges | body.metadata.atribute_2  | es igual a | 85P                           |
      | charges | body.metadata.atribute_3  | es igual a | NV3SWTYI965MLR6OOQO8G         |
      | charges | body.metadata.atribute_4  | es igual a | IVZEI2K3YO51PR3LB1HNK41Q      |
      | charges | body.metadata.atribute_5  | es igual a | 3Y9SKM1CABOGO6FYFCTC8TEGDVS64 |
      | charges | body.metadata.atribute_6  | es igual a | 6                             |
      | charges | body.metadata.atribute_7  | es igual a | XT8FVKA                       |
      | charges | body.metadata.atribute_8  | es igual a | OWXEGWMLT5YKUDNO00C6P62       |
      | charges | body.metadata.atribute_9  | es igual a | 0H7YD82XATNRZ5HKYFP           |
      | charges | body.metadata.atribute_10 | es igual a | HI3KFKYQ2DNS0GA0OCHGPL        |
      | charges | body.metadata.atribute_11 | es igual a | FU6NQKHWAKKKH4C6AX2C8         |
      | charges | body.metadata.atribute_12 | es igual a | UJNHIJOCIFY519S8LBYFMJG       |
      | charges | body.metadata.atribute_13 | es igual a | AH4L4FC60G2MJEUPBSP62T3PE9    |
      | charges | body.metadata.atribute_14 | es igual a | TMW1LTX                       |
      | charges | body.metadata.atribute_15 | es igual a | YZZT9XH1I6R6B8EP2ZB3D5T1HRZ   |
      | charges | body.metadata.atribute_16 | es igual a | NEXW1E5TL5XI                  |
      | charges | body.metadata.atribute_17 | es igual a | SGWM33XKZULTA18               |
      | charges | body.metadata.atribute_18 | es igual a | 80D607TXA6GP8322UT            |
      | charges | body.metadata.atribute_19 | es igual a | NIA0ZXKE                      |

  Escenario: CP007 - API [ACTUALIZAR-CARGO] | Con mas atributos del maximo permitido
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"metadata": {"atribute_1":"3EKDZ1SLDXHSPSKPMIEM4","atribute_2":"0AJ16LY4G2UQK9UM1NZHECG","atribute_3":"NGA3B1ISHAEFMIB","atribute_4":"F6CSHTE774LA1FEKIS3SWZ","atribute_5":"LSUULSG1GEHG7","atribute_6":"58EUB5GC1UGCSHWF8RXKOZ2G5UYL3","atribute_7":"G012LPANXE4UNOPQV5GAK956O","atribute_8":"235CV2CPI2","atribute_9":"SDS97QWB9OAV4TYQSPIDDDMODVDI8R","atribute_10":"64O6UBGGVDRFOPNI8ZRJZNLU77L3","atribute_11":"J7ZGV0OZLSYRN9SOBDUDU23MWB","atribute_12":"VYCQ1T938R7LMXEEPU2","atribute_13":"C2HD7E4Q27PYIDLY791UUIMO1I0","atribute_14":"NJTG8","atribute_15":"F8V4KN","atribute_16":"DUDO","atribute_17":"J15W73","atribute_18":"Y0LHNTEWDIS61RJ4","atribute_19":"E24F5ZEUB2YX4IAPCV7HJX4","atribute_20":"JAPZNTH9671Q29XQWAH9EWB5JFVRY","atribute_21":"JINAK0RRFUTR56FRXAG6G1VNQT6H"}} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                          |
      | charges | status                | es igual a | 400                                                            |
      | charges | body.object           | es igual a | error                                                          |
      | charges | body.param            | es igual a | metadata                                                       |
      | charges | body.type             | es igual a | parameter_error                                                |
      | charges | body.merchant_message | es igual a | Enviaste más de 20 parámetros en el metadata. El limite es 20. |

  Escenario: CP008 - API [ACTUALIZAR-CARGO] | Con valores cuya tamanio excede el tamanio maximo permitido.
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | body                                                                                                                                                                                                                                                                                    |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"metadata": {"atribute":"FVK6V5HGQOZ4CO1IMVHXIGKU6HSACYUIUIO7RX1GZL1YHRD8D07KR57I2ODFPED4RHYH3VGW2HB3404VHEQS3BHTB6UYWV1NMDGXWWBXQKY3OI1XCE9Y2D9K2PMBTOQ613LVEGBLT7UFQ4LBAAM5UGHZ9E47EAM0XJ8JGTFIZ5SJHTETJKF4IA5N6K8FE8T8Y7F1YL1II5YUKVT11OQFAFGM5JWTIAG0X5VDV0GI7T2KI0SRE1IML44GTE"}} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                                                             |
      | charges | status                | es igual a   | 400                                                                                               |
      | charges | body.object           | es igual a   | error                                                                                             |
      | charges | body.param            | es igual a   | metadata                                                                                          |
      | charges | body.type             | es igual a   | parameter_error                                                                                   |
      | charges | body.merchant_message | que contiene | de la metadata, su valor excede el límite de caracteres. El limite de valor es de 200 caracteres. |
      | charges | body.user_message     | es igual a   | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                  |

  Escenario: CP009 - API [ACTUALIZAR-CARGO] | Con llaves cuyo identificador excede el tamanio maximo permitido.
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | body                                                       |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"metadata": {"1XABSTCX2W9UJ28ENS0XZ1HC92MT37F7V_0":"AN"}} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                                                                     |
      | charges | status                | es igual a   | 400                                                                                                       |
      | charges | body.object           | es igual a   | error                                                                                                     |
      | charges | body.param            | es igual a   | metadata                                                                                                  |
      | charges | body.type             | es igual a   | parameter_error                                                                                           |
      | charges | body.merchant_message | que contiene | de la metadata excede el límite de caracteres. El lÍmite para el nombre de parámetro es de 30 caracteres. |
      | charges | body.user_message     | es igual a   | Hubo algunos problemas al intentar validar tu compra. Contáctanos para ayudarte.                          |

  Escenario: CP010 - API [ACTUALIZAR-CARGO] | Con endpoint inválido (Usar la ruta secure).
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                           |
      | #SECURE_URL#/#CHARGE_ID_FAKE# |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "403"

  Escenario: CP011 - API [ACTUALIZAR-CARGO] | Con código de comercio (llave pública - pk)
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | headers                    |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : "#PK#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                      |
      | charges | status                | es igual a | 401                                                                                                                        |
      | charges | body.object           | es igual a | error                                                                                                                      |
      | charges | body.type             | es igual a | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP012 - API [ACTUALIZAR-CARGO] | Con llave privada (sk) no activa.
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | headers                                         |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : "#MERCHANT_SK_DEACTIVATED#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters  | condition  | value                |
      | charges | status      | es igual a | 401                  |
      | charges | body.object | es igual a | error                |
      | charges | body.type   | es igual a | authentication_error |

  Escenario: CP013 - API [ACTUALIZAR-CARGO] | Con código de comercio (llave pública - pk) que no existe
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | headers                                              |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : "#MERCHANT_SK_NON_EXISTING_ENV#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP014 - API [ACTUALIZAR-CARGO] | Sin enviar un código de comercio (llave privada - SK)
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | headers                |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : ""} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                      |
      | charges | status                | es igual a | 401                                                                                                                        |
      | charges | body.object           | es igual a | error                                                                                                                      |
      | charges | body.type             | es igual a | authentication_error                                                                                                       |
      | charges | body.merchant_message | es igual a | La llave de autenticación enviada no es válida. Contáctate con culqi.com/soporte para obtener más información.             |
      | charges | body.user_message     | es igual a | El comercio tiene problemas de integración con Culqi. Debe contactarse con culqi.com/soporte para obtener más información. |

  Escenario: CP015 - API [ACTUALIZAR-CARGO] | Con llave privada (sk) inválida.
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                         | headers                                     |
      | #BASE_URL#/#CHARGE_ID_FAKE# | {"Authorization" : "#MERCHANT_SK_INVALID#"} |
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters  | condition  | value                |
      | charges | status      | es igual a | 401                  |
      | charges | body.object | es igual a | error                |
      | charges | body.type   | es igual a | authentication_error |

	#--------------------- CULQI2 -----------------------------#
  Escenario: CP029 - [UnHappy] API [ACTUALIZAR-CARGO] | con Path Id (Requerido) [Valor (String) Mayor a 25 caracteres] [401]
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                                   |
      | #BASE_URL#/chr_live_R7HIXJzxlrnTEilW1 |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP030 - [UnHappy] API [ACTUALIZAR-CARGO] | con Path Id (Requerido) [Valor (String) Menor a 25 caracteres] [400]
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url                                 |
      | #BASE_URL#/chr_live_R7HIXJzxlrnTEil |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  Escenario: CP032 - [UnHappy] API [ACTUALIZAR-CARGO] | con Path Id (Requerido) [Inexistente] [400]
    Cuando una petición PATCH es enviada al endpoint "charges"
      | url         |
      | #BASE_URL#/ |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                              |
      | charges | status                | es igual a | 401                                                                |
      | charges | body.object           | es igual a | error                                                              |
      | charges | body.type             | es igual a | authentication_error                                               |
      | charges | body.merchant_message | es igual a | Ruta inválida, entérate de las rutas en https://apidocs.culqi.com. |

  