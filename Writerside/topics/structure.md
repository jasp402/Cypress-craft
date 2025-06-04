# Estructura del proyecto

Este documento describe la disposición de carpetas generada por `cypress-craft-init`. Mantener esta organización ayuda a localizar fácilmente las pruebas y los archivos de apoyo.

## Descripción de carpetas

- `cypress/common/` – Step definitions de Cucumber en inglés y español junto con utilidades compartidas.
- `cypress/fixtures/` – URLs base y datos de prueba por ambiente. También gestiona variables dinámicas.
- `cypress/pom/` – Clases del Page Object Model para pruebas API y E2E. `main.pom.js` centraliza validaciones y peticiones HTTP.
- `cypress/settings/` – Configuración del preprocesador de Cucumber y otros helpers.
- `cypress/support/` – Comandos personalizados de Cypress que unifican la generación de logs y reportes en HTML.
- `cypress/tests_en/` y `cypress/tests_es/` – Features de ejemplo en Gherkin para distintos escenarios.
- `scripts/` – Contiene `post-install.js`, el asistente de configuración inicial.
- `Writerside/` – Documentación adicional en formato markdown.

## Archivos principales

Revisa `cypress.config.js` para definir el ambiente de ejecución y la ruta de las pruebas. Cada carpeta incluye ejemplos que puedes modificar según las necesidades de tu proyecto.
