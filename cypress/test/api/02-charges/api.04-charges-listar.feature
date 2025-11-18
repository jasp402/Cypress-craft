# language: es
Característica: CULQI API | Suite 004: Pruebas del métodos [GET] - [LISTAR CARGOS]
  Más información viste: https://apidocs.culqi.com/#tag/Cargos/operation/listar-cargo

  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "charges"

  Escenario: CP001 - API [LISTAR-CARGO] | Listar todos los cargos (se muestran los primeros 50) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 1     |
      | charges | body.data  | tiene una longitud menor a | 60    |

  Escenario: CP002 - API [LISTAR-CARGO] | Verificar filtro por 'amount' con valor (igual a 300) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs              |
      | {"amount": 300} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters          | condition                  | value |
      | charges | status              | es igual a                 | 200   |
      | charges | body.data           | tiene una longitud mayor a | 1     |
      | charges | body.data[0].amount | es igual a                 | 300   |

  Escenario: CP003 - API [LISTAR-CARGO] | Verificar filtro por 'amount' con valor (no numérico igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                |
      | {"amount": "abc"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                      |
      | charges | status                | es igual a   | 400                                        |
      | charges | body.merchant_message | que contiene | El filtro 'amount' tiene un valor inválido |

  Escenario: CP004 - API [LISTAR-CARGO] | Verificar filtro por 'amount' con valor (menor al mínimo permitido igual a 0) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs            |
      | {"amount": 0} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                             |
      | charges | status                | es igual a | 400                                                                                                               |
      | charges | body.merchant_message | es igual a | El filtro 'amount' tiene un valor inválido. El valor de 'amount' debe ser mayor o igual que 100 (1 sol, 1 dólar). |
      | charges | body.param            | es igual a | amount                                                                                                            |

  Escenario: CP005 - API [LISTAR-CARGO] | Verificar filtro por 'amount' con valor (mayor al máximo permitido igual a 999999999) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                    |
      | {"amount": 999999999} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                   |
      | charges | status                | es igual a   | 400                                                     |
      | charges | body.merchant_message | que contiene | El valor de 'amount' debe ser de no más de S/ 99,999.00 |

  Escenario: CP006 - API [LISTAR-CARGO] | Verificar filtro por 'min_amount' con valor (igual a 300) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"min_amount": 300} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 1     |

  Escenario: CP007 - API [LISTAR-CARGO] | Verificar filtro por 'min_amount' con valor (menor al mínimo permitido igual a 0) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                |
      | {"min_amount": 0} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                     |
      | charges | status                | es igual a | 400                                                                                                                       |
      | charges | body.merchant_message | es igual a | El filtro 'min_amount' tiene un valor inválido. El valor de 'min_amount' debe ser mayor o igual que 100 (1 sol, 1 dólar). |
      | charges | body.param            | es igual a | min_amount                                                                                                                |

  Escenario: CP008 - API [LISTAR-CARGO] | Verificar filtro por 'min_amount' con valor (mayor al máximo permitido igual a 999999999) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                        |
      | {"min_amount": 999999999} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                         |
      | charges | status                | es igual a | 400                                                                                                           |
      | charges | body.merchant_message | es igual a | El filtro 'min_amount' tiene un valor inválido. El valor de 'min_amount' debe ser de no más de S/ 99,999.00'. |
      | charges | body.param            | es igual a | min_amount                                                                                                    |

  Escenario: CP009 - API [LISTAR-CARGO] | Verificar filtro por 'max_amount' con valor (igual a 400) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"max_amount": 400} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 1     |

  Escenario: CP010 - API [LISTAR-CARGO] | Verificar filtro por 'max_amount' con valor (menor al mínimo permitido igual a 0) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                |
      | {"max_amount": 0} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                     |
      | charges | status                | es igual a | 400                                                                                                                       |
      | charges | body.merchant_message | es igual a | El filtro 'max_amount' tiene un valor inválido. El valor de 'max_amount' debe ser mayor o igual que 100 (1 sol, 1 dólar). |
      | charges | body.param            | es igual a | max_amount                                                                                                                |

  Escenario: CP011 - API [LISTAR-CARGO] | Verificar filtro por 'max_amount' con valor (mayor al máximo permitido) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                        |
      | {"max_amount": 999999999} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                         |
      | charges | status                | es igual a | 400                                                                                                           |
      | charges | body.merchant_message | es igual a | El filtro 'max_amount' tiene un valor inválido. El valor de 'max_amount' debe ser de no más de S/ 99,999.00'. |
      | charges | body.param            | es igual a | max_amount                                                                                                    |

  Escenario: CP012 - API [LISTAR-CARGO] | Verificar filtro por 'installments' con valor (igual a 3) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"installments": 3} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP013 - API [LISTAR-CARGO] | Verificar filtro por 'installments' con valor (no numérico igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                      |
      | {"installments": "abc"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                          |
      | charges | status                | es igual a   | 400                                                            |
      | charges | body.merchant_message | que contiene | El filtro 'installments' tiene un valor inválido o está vacio. |

  Escenario: CP014 - API [LISTAR-CARGO] | Verificar filtro por 'installments' con valor (menor al mínimo permitido igual a -1) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                   |
      | {"installments": -1} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP015 - API [LISTAR-CARGO] | Verificar filtro por 'installments' con valor (mayor al máximo permitido igual a 999999999999) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                             |
      | {"installments": 999999999999} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP016 - API [LISTAR-CARGO] | Verificar filtro por 'min_installments' con valor (igual a 3) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                      |
      | {"min_installments": 3} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP017 - API [LISTAR-CARGO] | Verificar filtro por 'min_installments' con valor (no numérico igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                          |
      | {"min_installments": "abc"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP018 - API [LISTAR-CARGO] | Verificar filtro por 'min_installments' con valor (menor al mínimo permitido igual a -1) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"min_installments": -1} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP019 - API [LISTAR-CARGO] | Verificar filtro por 'min_installments' con valor (mayor al máximo permitido igual a 99999999999999) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                   |
      | {"min_installments": 99999999999999} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP020 - API [LISTAR-CARGO] | Verificar filtro por 'max_installments' con valor (igual a 3) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                      |
      | {"max_installments": 3} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 1     |

  Escenario: CP021 - API [LISTAR-CARGO] | Verificar filtro por 'max_installments' con valor (no numérico igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                          |
      | {"max_installments": "abc"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                          |
      | charges | status                | es igual a   | 400                                                            |
      | charges | body.merchant_message | que contiene | El filtro 'installments' tiene un valor inválido o está vacio. |

  Escenario: CP022 - API [LISTAR-CARGO] | Verificar filtro por 'max_installments' con valor (menor al mínimo permitido igual a -1) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"max_installments": -1} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP023 - API [LISTAR-CARGO] | Verificar filtro por 'max_installments' con valor (mayor al máximo permitido igual a 99999999999999) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                   |
      | {"max_installments": 99999999999999} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                          |
      | charges | status                | es igual a   | 400                                                            |
      | charges | body.merchant_message | que contiene | El filtro 'installments' tiene un valor inválido o está vacio. |

  Escenario: CP024 - API [LISTAR-CARGO] | Verificar filtros por 'min_installments' (igual a 3) y 'max_installments' (igual a 10) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                              |
      | {"min_installments": 3, "max_installments": 10} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP025 - API [LISTAR-CARGO] | Verificar filtro por 'currency_code' con valor (igual a USD) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"currency_code": "USD"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP026 - API [LISTAR-CARGO] | Verificar filtro por 'currency_code' con valor (no válido igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"currency_code": "abc"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition    | value                                                          |
      | charges | status                | es igual a   | 400                                                            |
      | charges | body.merchant_message | que contiene | El filtro 'currency_code' tiene un valor inválido o está vacío |

  Escenario: CP027 - API [LISTAR-CARGO] | Verificar filtro por 'code' con valor (de 5 caracteres) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"code": "AUT0000"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP028 - API [LISTAR-CARGO] | Verificar filtro por 'code' con valor (menor al mínimo permitido igual a vacío) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs            |
      | {"code": " "} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP029 - API [LISTAR-CARGO] | Verificar filtro por 'code' con valor (mayor al máximo permitido igual a aeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                                                               |
      | {"code": "aeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  @skip #No existen registros con decline_code 'incorrect_cvv'
  Escenario: CP030 - API [LISTAR-CARGO] | Verificar filtro por 'decline_code' con valor (igual a incorrect_cvv) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                |
      | {"decline_code": "incorrect_cvv"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 0     |

  Escenario: CP031 - API [LISTAR-CARGO] | Verificar filtro por 'decline_code' con valor (menor al mínimo permitido igual a vacío) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                    |
      | {"decline_code": " "} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP032 - API [LISTAR-CARGO] | Verificar filtro por 'decline_code' con valor (mayor al máximo permitido igual a aeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                                                                       |
      | {"decline_code": "aeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiouaeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP033 - API [LISTAR-CARGO] | Verificar filtro por 'first_name' con valor válido (igual a Jose) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"first_name": "Wilson"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP034 - API [LISTAR-CARGO] | Verificar filtro por 'first_name' con valor (menor al mínimo permitido igual a a) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"first_name": "a"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP035 - API [LISTAR-CARGO] | Verificar filtro por 'first_name' con valor (mayor al máximo permitido igual a aeiouaeiou aeiouaeiouaeiou aeiouaeiouaeiouaeiouaeiouaeiouaeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                               |
      | {"first_name": "aeiouaeiou aeiouaeiouaeiou aeiouaeiouaeiouaeiouaeiouaeiouaeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP036 - API [LISTAR-CARGO] | Verificar filtro por 'last_name' con valor válido (igual a Perez) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                          |
      | {"last_name": "Villanueva"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP037 - API [LISTAR-CARGO] | Verificar filtro por 'last_name' con valor (menor al mínimo permitido igual a a) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                 |
      | {"last_name": "a"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP038 - API [LISTAR-CARGO] | Verificar filtro por 'last_name' con valor (mayor al máximo permitido igual a aeiouaeiou aeiouaeiouaeiou aeiouaeiouaeiouaeiouaeiouaeiouaeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                              |
      | {"last_name": "aeiouaeiou aeiouaeiouaeiou aeiouaeiouaeiouaeiouaeiouaeiouaeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP039 - API [LISTAR-CARGO] | Verificar filtro por 'email' con valor válido (igual a testqa@testqa.com) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                             |
      | {"email": "testqa@testqa.com"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP040 - API [LISTAR-CARGO] | Verificar filtro por 'email' con valor (menor al mínimo permitido igual a que) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs               |
      | {"email": "que"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP041 - API [LISTAR-CARGO] | Verificar filtro por 'email' con valor (mayor al máximo permitido igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                                                                                    |
      | {"email": "ABCDEABCABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP042 - API [LISTAR-CARGO] | Verificar filtro por 'email' con valor no válido (igual a abc) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs               |
      | {"email": "abc"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP043 - API [LISTAR-CARGO] | Verificar filtro por 'address' con valor válido (igual a Via Tommaso Pisano 1, 56123) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                         |
      | {"address": "Via Tommaso Pisano 1, 56123"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP044 - API [LISTAR-CARGO] | Verificar filtro por 'address' con valor (menor al mínimo permitido igual a Av.) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                 |
      | {"address": "Av."} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP045 - API [LISTAR-CARGO] | Verificar filtro por 'address' con valor (mayor al máximo permitido igual a Avenida Proceres de la Independencia 151, departamento 18, Urbanizacion Atahualpa, 5 Etapa, San Juan de Lurigancho.) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                                                                                 |
      | {"address": "Avenida Proceres de la Independencia 151, departamento 18, Urbanizacion Atahualpa, 5 Etapa, San Juan de Lurigancho."} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP046 - API [LISTAR-CARGO] | Verificar filtro por 'address_city' con valor válido (igual a LIMA) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"address_city": "LIMA"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP047 - API [LISTAR-CARGO] | Verificar filtro por 'address_city' con valor (menor al mínimo permitido igual a L) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                    |
      | {"address_city": "L"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP048 - API [LISTAR-CARGO] | Verificar filtro por 'address_city' con valor (mayor al máximo permitido igual a SAN JUAN DE LURIGANCHO - LIMA - PERU) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                       |
      | {"address_city": "SAN JUAN DE LURIGANCHO - LIMA - PERU"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP049 - API [LISTAR-CARGO] | Verificar filtro por 'phone_number' con valor válido (igual a 998715612) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                          |
      | {"phone_number": 955722398} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP050 - API [LISTAR-CARGO] | Verificar filtro por 'phone_number' con valor (menor al mínimo permitido igual a 1234) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                     |
      | {"phone_number": 1234} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP051 - API [LISTAR-CARGO] | Verificar filtro por 'phone_number' con valor (mayor al máximo permitido igual a 9876543210987654321) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                    |
      | {"phone_number": 9876543210987654321} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP052 - API [LISTAR-CARGO] | Verificar filtro por 'country_code' con valor válido (igual a PE) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                     |
      | {"country_code": "PE"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP053 - API [LISTAR-CARGO] | Verificar filtro por 'country_code' con valor no válido (igual a XX) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                     |
      | {"country_code": "XX"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP054 - API [LISTAR-CARGO] | Verificar filtro por 'captured' con valor válido (igual a true) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                 |
      | {"captured": true} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters           | condition  | value |
      | charges | status               | es igual a | 200   |
      | charges | body.data[0].capture | es igual a | true  |
      | charges | body.data[1].capture | es igual a | true  |

  Escenario: CP055 - API [LISTAR-CARGO] | Verificar filtro por 'captured' con valor no válido (igual a wrong_value) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                          |
      | {"captured": "wrong_value"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP056 - API [LISTAR-CARGO] | Verificar filtro por 'reference_code' con valor válido (igual a 1002418) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                          |
      | {"reference_code": 1002418} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP057 - API [LISTAR-CARGO] | Verificar filtro por 'reference_code' con valor (menor al mínimo permitido) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"reference_code": "ab"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP058 - API [LISTAR-CARGO] | Verificar filtro por 'reference_code' con valor (mayor al máximo permitido igual a ABCDEABCDEABCDEABABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDECDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                                                                                             |
      | {"reference_code": "ABCDEABCDEABCDEABABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDECDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP059 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date' con valor válido (igual a 1612535064) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                            |
      | {"creation_date": 1612535064} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP060 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date' con valor no válido (igual a aaaaaaaaa) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                             |
      | {"creation_date": "aaaaaaaaa"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP061 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date' con valor futuro (igual a 1929217569) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                            |
      | {"creation_date": 1710876176} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP062 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date_from' con valor válido (igual a 1612535064) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                 |
      | {"creation_date_from": 1612535064} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP063 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date_from' con valor no válido (igual a aaaaaaaaa) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                  |
      | {"creation_date_from": "aaaaaaaaa"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP064 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date_from' con valor futuro (igual a 1929217569) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                 |
      | {"creation_date_from": 1710876176} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP065 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date_to' con valor válido (igual a 1612535064) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                               |
      | {"creation_date_to": 1612535064} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP066 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date_to' con valor no válido (igual a aaaaaaaaa) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                |
      | {"creation_date_to": "aaaaaaaaa"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP067 - API [LISTAR-CARGO] | Verificar filtro por 'creation_date_to' con valor futuro (igual a 1929217569) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                               |
      | {"creation_date_to": 1710876176} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP068 - API [LISTAR-CARGO] | Verificar filtro por rango de fecha de creación (creation_date_from y creation_date_to) con valores válidos y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                                                 |
      | {"creation_date_from": 1691535065, "creation_date_to": 1692535065} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP069 - API [LISTAR-CARGO] | Verificar filtro por 'card_brand' con valor válido (igual a visa) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                     |
      | {"card_brand": "visa"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP070 - API [LISTAR-CARGO] | Verificar filtro por 'card_brand' con valor no válido (igual a aeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                      |
      | {"card_brand": "aeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                                           |


      | charges | status                | es igual a | 400                                                                                                                                                             |
      | charges | body.merchant_message | es igual a | El filtro 'card_brand' tiene un valor inválido o está vacio. Estos son los únicos valores permitidos: 'visa', 'mastercard', 'american_express' o 'diners_club'. |

  Escenario: CP071 - API [LISTAR-CARGO] | Verificar filtro por 'card_type' con valor válido (igual a credito) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                       |
      | {"card_type": "credito"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP072 - API [LISTAR-CARGO] | Verificar filtro por 'card_type' con valor no válido (igual a aeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                     |
      | {"card_type": "aeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters            | condition  | value                                                                                                                                    |
      | charges | status                | es igual a | 400                                                                                                                                      |
      | charges | body.merchant_message | es igual a | El filtro 'card_type'  tiene un valor inválido o está vacio. Estos son los únicos valores permitidos: 'credito', 'debito' o 'prepagada'. |

  Escenario: CP073 - API [LISTAR-CARGO] | Verificar filtro por 'bin' con valor válido (igual a 411111) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs              |
      | {"bin": 411111} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP074 - API [LISTAR-CARGO] | Verificar filtro por 'bin' con valor menor al mínimo permitido (sin valor) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs          |
      | {"bin": ""} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP075 - API [LISTAR-CARGO] | Verificar filtro por 'bin' con valor mayor al máximo permitido (igual a 4111111111) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"bin": 4111111111} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP076 - API [LISTAR-CARGO] | Verificar filtro por 'before' con valor válido (#ID_BEFORE_AUTOGEN#) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs           |
      | {"limit": 2} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 1     |
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                                |
      | {"before": "#ID_BEFORE_AUTOGEN#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP077 - API [LISTAR-CARGO] | Verificar filtro por 'before' con valor no válido (igual a aeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                  |
      | {"before": "aeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP078 - API [LISTAR-CARGO] | Verificar filtro por 'after' con valor válido (#ID_AFTER_AUTOGEN#) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs           |
      | {"limit": 2} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"

    Entonces la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>
      | service | parameters | condition                  | value |
      | charges | status     | es igual a                 | 200   |
      | charges | body.data  | tiene una longitud mayor a | 1     |
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                              |
      | {"after": "#ID_AFTER_AUTOGEN#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP079 - API [LISTAR-CARGO] | Verificar filtro por 'after' con valor no válido (igual a aeiou) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs                 |
      | {"after": "aeiou"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP080 - API [LISTAR-CARGO] | Verificar filtro por 'limit' con valor válido (igual a 6) y como respuesta (status 200)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs           |
      | {"limit": 6} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"

  Escenario: CP081 - API [LISTAR-CARGO] | Verificar filtro por 'limit' con valor inválido (igual a -5) y como respuesta (status 400)
    Cuando una petición GET es enviada al endpoint "charges"
      | qs            |
      | {"limit": -5} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "400"

  Escenario: CP082 - API [LISTAR-CARGO] | Con endpoint inválido (Usar la ruta secure).
    Cuando una petición GET es enviada al endpoint "charges"
      | url                      |
      | #SECURE_URL#/#CHARGE_ID# |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "403"

  Escenario: CP083 - API [LISTAR-CARGO] | Verificar código de comercio (llave pública - pk) válida (#PK#) y como respuesta (status 401)
    Cuando una petición GET es enviada al endpoint "charges"
      | headers                    |
      | {"Authorization" : "#PK#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP084 - API [LISTAR-CARGO] | Verificar sin enviar un código de comercio (llave privada - sk) (#MERCHANT_WITHOUT_SK#) y como respuesta (status 401)
    Cuando una petición GET es enviada al endpoint "charges"
      | headers                |
      | {"Authorization" : ""} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP085 - API [LISTAR-CARGO] | Verificar llave privada (sk) inválida y como respuesta (status 401)
    Cuando una petición GET es enviada al endpoint "charges"
      | headers                                     |
      | {"Authorization" : "#MERCHANT_SK_INVALID#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP086 - API [LISTAR-CARGO] | Verificar llave privada (sk) no activa (#MERCHANT_SK_DEACTIVATED#) y como respuesta (status 401)
    Cuando una petición GET es enviada al endpoint "charges"
      | headers                                         |
      | {"Authorization" : "#MERCHANT_SK_DEACTIVATED#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"

  Escenario: CP087 - API [LISTAR-CARGO] | Verificar llave privada (sk) que no existe (#MERCHANT_SK_NON_EXISTING_ENV#) y como respuesta (status 401)
    Cuando una petición GET es enviada al endpoint "charges"
      | headers                                              |
      | {"Authorization" : "#MERCHANT_SK_NON_EXISTING_ENV#"} |
    Cuando se muestre la petición de "charges"
    Cuando se muestre la respuesta de "charges"
    Entonces la respuesta en "charges" debe tener el parámetro "status" con la condición "es igual a" y el valor "401"