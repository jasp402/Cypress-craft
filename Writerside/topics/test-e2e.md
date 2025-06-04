# Sobre pruebas E2E

Las pruebas end-to-end validan el flujo completo de la aplicación. En CypressCraft se almacenan en `cypress/tests_en/e2e` o `tests_es/e2e`.

## Convenciones para archivos `.feature`
- Nombrar los archivos como `e2e.XX-descripcion.feature` usando un número para ordenar.
- Especificar el idioma si corresponde, por ejemplo:
  ```bash
  # language: es
  ```
- Mantener un `Background` con la inicialización del Page Object Model cuando sea necesario.

## Ejemplo de feature
```gherkin
# language: en
Feature: Login Page
  Background:
    Given the Page Object Model configuration for "login" has been initialized

  Scenario: Login success
    When the user should type in the field "usernameInput" with value "standard_user"
    When the user should type in the field "passwordInput" with value "secret_sauce"
    When the user should clic in the button "loginBtn"
    Then the element "title" should "have text" "Swag Labs"
```

## Recomendaciones
- Utilizar escenarios claros y concisos que reflejen el flujo real del usuario.
- Aprovechar los comandos personalizados de CypressCraft para acciones repetitivas.
- Generar datos a través de variables dinámicas cuando el ambiente lo requiera.
