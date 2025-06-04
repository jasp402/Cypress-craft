# Sobre pruebas API

CypressCraft permite automatizar servicios REST de forma sencilla. La carpeta `cypress/tests_en/api` (o `tests_es/api`) contiene los archivos `.feature` escritos en Gherkin. Cada feature representa un conjunto coherente de pruebas para un endpoint.

## Convenciones para archivos `.feature`
- El nombre debe seguir el formato `api.XX-descripcion.feature` donde `XX` es un número secuencial que facilita el orden.
- Incluir la directiva de idioma al inicio si el proyecto está en español:
  ```bash
  # language: es
  ```
- Utilizar títulos y descripciones claras. Un feature puede contener varios escenarios relacionados con el mismo servicio.

## Ejemplo
```gherkin
# language: en
Feature: Example test for JSONPlaceholder
  Scenario: Retrieve specific post
    When a GET request is sent to the "posts" endpoint
      | url                |
      | #BASE_URL#/posts/1 |
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"
```

## Buenas prácticas
- Agrupar los escenarios en carpetas según la funcionalidad probada.
- Reutilizar los *step definitions* disponibles para mantener consistencia.
- Combinar variables dinámicas cuando se necesiten valores distintos por ambiente.
