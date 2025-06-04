# Guía Completa de CypressCraft

Esta guía ofrece una visión integral de **CypressCraft**, la librería que extiende a [Cypress](https://www.cypress.io/) para facilitar la automatización de pruebas E2E y API.

## Propósito del proyecto
CypressCraft surge de la necesidad de contar con un entorno de pruebas unificado y fácil de escalar. Combina buenas prácticas, integración con [Cucumber](https://www.npmjs.com/package/cypress-cucumber-preprocessor) y un modelo de páginas (POM) que reduce la duplicidad de código.

Su objetivo principal es simplificar la configuración de proyectos, centralizar los datos de prueba y permitir una transición fluida entre entornos y tipos de pruebas (frontend o backend).

## Características clave
- **Instalación guiada** mediante el comando `cypress-craft-init`.
- **Estructura predefinida** de carpetas para API y E2E.
- **Soporte multi‑ambiente** y manejo de datos dinámicos.
- **Integración con Cucumber** para definir pruebas en lenguaje natural.
- **Plantillas de POM** listas para usar.
- **Generación de reportes HTML** con `multiple-cucumber-html-reporter`.

## Arquitectura general
El proyecto instalado queda organizado del siguiente modo:

```
cypress/
  ├─ common/            # step definitions y helpers
  ├─ fixtures/          # urls, datos y variables dinámicas
  ├─ pom/               # clases POM para API y E2E
  ├─ settings/          # configuración de Cucumber y utilidades
  ├─ support/           # comandos custom de Cypress
  ├─ tests_en/          # features de ejemplo en inglés
  └─ tests_es/          # features de ejemplo en español
scripts/
  └─ post-install.js    # asistente de configuración
```

La personalización se realiza editando `cypress.config.js`, donde se indica el ambiente de ejecución y la ruta de las pruebas.

## Flujo de trabajo recomendado
1. Ejecutar `npm init -y` e instalar la dependencia `cypress-craft`.
2. Correr `npx cypress-craft-init` y seguir el asistente.
3. Ajustar URLs y datos en la carpeta `fixtures`.
4. Crear o modificar clases en `pom` según los escenarios.
5. Escribir los pasos en `tests_en` o `tests_es` utilizando Cucumber.
6. Lanzar las pruebas con `npm start` y seleccionar el feature.

## Buenas prácticas
- Mantener separados los POM de API y E2E para una mejor mantenibilidad.
- Reutilizar funciones comunes en `main.pom.js`.
- Usar variables dinámicas (`#VAR#`) para datos que cambian según el entorno.
- Versionar la carpeta `Writerside` para conservar la documentación junto al código.

## Integración continua
CypressCraft puede integrarse con cualquier servicio de CI/CD que ejecute Node.js. Asegura instalar las dependencias, ejecutar `cypress-craft-init` en modo no interactivo y usar el reporte HTML para revisar resultados en el pipeline.

Para más detalles consulta los otros temas de esta sección.
