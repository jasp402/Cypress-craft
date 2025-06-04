<div style="background: #e3f5ec;" align="center">
    <img src="https://github.com/jasp402/Cypress-craft/assets/8978470/f75a5260-d16c-437a-978d-0da5e5bb5759" width="1024" alt="CypressCraft Logo">
</div>


# 📦 CypressCraft
> _We had fun creating this app. So you can have fun trying._

# What is CypressCraft?
It is a library for **[nodeJS](https://nodejs.org/en)** distributed via **[NPM](https://www.npmjs.com/package/cypress-craft)**. In essence, it is an **[Cypress](https://www.cypress.io/)** extension _(unofficial - created by the community)_. It concentrates best practices for E2E and API testing through multiple libraries, design patterns and better code organization.
This project represents our own enhanced version of Cypress, adding what we felt was missing for very specific needs: **POM**, **Cucumber**, **Gherkin**, built-in reporting, dynamic data management and multi-environment support.
The library is characterized by the integration of BDD using Cucumber and Gherkin, advanced design patterns like Page Object Model (POM) and Factory Pattern, and a Singleton Pattern specifically adapted to Cypress' versatile nature.


It also has the ability to manage multiple environments, dynamic data, and a structure designed specifically for managing APIs. This integration not only improves automated test setup, but also facilitates a more organized and maintainable test code structure. It provides a clear template to follow when building test cases.



---

<div style="background: #e3f5ec;" align="center">
    <img src="https://github.com/jasp402/Cypress-craft/assets/8978470/fca61caa-5d10-4ef6-9b0c-0f84b1be6bba" width="1024" alt="CypressCraft Logo">
</div>

---
# Why Cypress Craft?
This library was designed especially for automation enthusiasts: With Cypress-Craft we try to redefine the way you write tests for API AND E2E.

As test automation professionals, many of us have explored the depths of Cypress, discovering both its strengths and limitations. Cypress shines in a variety of FrontEnd (E2E) testing scenarios, but it also has its limitations, especially when it comes to non-native functionality, such as handling API tests or integrations with cucumber and Gherkins, handling multiple environments or managing dynamic data.

This library not only shares the desire to simplify the integration process with cucumber and improve the API testing experience. But it also shares our experience of many years. Trying to improve and simplify processes. Inside the world of automation.

---

CypressCraft key innovations include:

- ### Optimization for API Testing:
   Although Cypress was not originally designed with a focus on API testing, we have fine-tuned and optimized its use for this purpose, ensuring a smooth and effective experience.
- ### Management of Multiple Environments:
   CypressCraft efficiently handles multiple test environments, allowing easy transition and configuration between different test contexts.
- ### Data Centralization:
   We have centralized the management of data, both dynamic and fixed, through specialized classes that control data from fixtures, thus improving the consistency and reusability of data in tests.
- ### Flexibility in Frontend and Backend:
   The sub-framework is designed to automatically adjust to API or frontend projects as needed, implementing highly optimized design patterns.

CypressCraft is the ideal solution for development and QA teams looking to minimize time and effort in the process of creating automations, while maintaining high standards of quality and efficiency. With the latest version of Cypress as a foundation, CypressCraft represents a significant evolution in the world of test automation.


## Repository Structure

The project template installed by `cypress-craft-init` follows a clear layout:

- **`cypress/common/`** – Cucumber step definitions in English and Spanish plus shared helpers.
- **`cypress/fixtures/`** – Centralized URLs and test data per environment with support for dynamic variables.
- **`cypress/pom/`** – Page Object classes for APIs and E2E tests. `main.pom.js` contains common logic for validations and HTTP requests.
- **`cypress/settings/`** – Cucumber preprocessor configuration and utilities.
- **`cypress/support/`** – Custom Cypress commands for unified logging and HTML reports.
- **`cypress/tests_en/`** and **`cypress/tests_es/`** – Example features in Gherkin for API and E2E scenarios in both languages.
- **`scripts/`** – Contains `post-install.js` which acts as an installation wizard.
- **`Writerside/`** – Additional documentation organized in markdown.


# Tabla de Contenidos
- [Introducción](#introducción)
- [Características](#características)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Manejo de Datos Dinámicos](#manejo-de-datos-dinámicos)
- [Añadir Step Definitions](#añadir-step-definitions)
- [Ejecución de Pruebas](#ejecución-de-pruebas)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)

# Introducción
Welcome to CypressCraft, an advanced sub-framework designed to revolutionize the way E2E and API testing is performed using Cypress. Developed by a team with more than four years of experience at Cypress, this sub-framework emerges as a comprehensive solution to overcome common challenges in test automation and maximize efficiency in software development.

CypressCraft extends Cypress' capabilities beyond its primary focus on E2E testing, tailoring it for optimal performance in API testing. With meticulous integration of design patterns such as the Page Object Model (POM) and Factory Pattern, CypressCraft not only simplifies the creation of automated tests but also makes them more maintainable and scalable.

This sub-framework is specially designed for teams looking for agility and precision in their testing, offering advanced features such as handling multiple environments, data centralization, and flexibility to adjust to API or frontend projects. Whether you're just getting started with Cypress or are an automated testing veteran, CypressCraft is here to enrich your experience and take your testing to the next level.



# Características
CypressCraft está equipado con una serie de características potentes y optimizaciones diseñadas para hacer que tus pruebas sean más eficientes y efectivas. Aquí hay una mirada a las principales características que hacen de CypressCraft una herramienta indispensable para la automatización de pruebas:

Optimización para Pruebas de API con Cypress: A pesar de que Cypress se centra principalmente en pruebas E2E, CypressCraft lo extiende para proporcionar soporte robusto y eficiente para pruebas de API.

Integración de Patrones de Diseño Avanzados: Implementamos patrones de diseño como POM y Factory Pattern para estructurar mejor las pruebas, mejorar la reutilización del código y facilitar el mantenimiento.

Manejo de Múltiples Ambientes: CypressCraft permite una fácil configuración y transición entre diferentes entornos de prueba, lo que lo hace ideal para pruebas en etapas de desarrollo, pruebas y producción.

Centralización de Datos: Ofrecemos una solución centralizada para gestionar tanto datos dinámicos como fijos, lo que aumenta la eficiencia y reduce la redundancia.

Adaptabilidad para Frontend y API: Diseñado para ser flexible, CypressCraft se adapta automáticamente a proyectos de API o frontend, lo que permite a los equipos concentrarse en la lógica de prueba sin preocuparse por la configuración de la herramienta.

Interfaz de Usuario Intuitiva y Documentación Completa: CypressCraft no solo es potente sino también fácil de usar, con una interfaz intuitiva y documentación completa que guía a los usuarios a través de todas sus funcionalidades.

Compatibilidad con la Última Versión de Cypress: Nos mantenemos al día con las últimas actualizaciones de Cypress, asegurando que los usuarios de CypressCraft siempre tengan acceso a las últimas características y mejoras en seguridad.


# Requisitos previos
Para aprovechar al máximo las capacidades de CypressCraft, es importante asegurarse de que tu sistema cumpla con los siguientes requisitos previos:

Cypress Versión Compatible: CypressCraft está diseñado para funcionar con las versiones más recientes de Cypress. Asegúrate de tener instalada la última versión de Cypress en tu sistema.

Node.js y npm: Dado que Cypress es una herramienta basada en Node.js, necesitarás tener Node.js y npm (Node Package Manager) instalados. Recomendamos usar la versión LTS (Long Term Support) más reciente de Node.js.

Navegadores Compatibles: Para pruebas E2E, asegúrate de tener instalados los navegadores compatibles con Cypress, como Chrome, Firefox, Edge, entre otros.

Entorno de Desarrollo: Un entorno de desarrollo adecuado para JavaScript/TypeScript, con editores como Visual Studio Code, Sublime Text o Atom, es recomendable para una mejor experiencia de codificación.

Conocimientos Básicos: Un entendimiento básico de Cypress, pruebas E2E, y pruebas de API es beneficioso para utilizar efectivamente CypressCraft.


# Instalación
Sigue estos pasos para instalar CypressCraft en tu proyecto y comenzar a aprovechar sus potentes características para pruebas automatizadas:

Para comenzar un proyecto realiza lo siguiente:

1. Inicializa un proyecto Node.js
   ```bash
   npm init -y
   ```
2. Instala Cypress y CypressCraft
   ```bash
   npm install cypress cypress-craft --save-dev
   ```
3. Ejecuta el asistente de configuración
   ```bash
   npx cypress-craft-init
   ```
   Aquí seleccionarás el idioma, el tipo de pruebas (API, E2E o ambos) y si deseas habilitar reportes.
4. (Opcional) agrega en `package.json` el script:
   ```json
   "start": "cypress open"
   ```
   Con esto podrás lanzar los ejemplos incluidos mediante `npm start`.

Consulta más detalles en [`Writerside/topics`](Writerside/topics).

# Uso
Revisa los ejemplos en `cypress/tests_en` y `cypress/tests_es`. Ejecuta `npm start` y elige el `feature` que desees para ver la estructura propuesta de pruebas API y E2E.

# Manejo de Datos Dinámicos
Las variables dinámicas se definen en `cypress/fixtures/data.js` usando los métodos `getDefaultData`, `getEnvironmentSpecificData` y `getTypeSpecificData`. Para utilizarlas en los archivos `feature` se escriben con almohadillas, por ejemplo `#USER_NAME#`. Revisa `cypress.config.js` para confirmar el ambiente activo.

# Añadir Step Definitions
Los pasos de Gherkin se implementan en `cypress/common/stepDefinition.js`. Si una función se reutiliza en varias clases se recomienda declararla en `main.pom.js` con nombre precedido por guión bajo. Solo se admiten `Given`, `When` y `Then`.

# Ejecución de Pruebas
1. Configura el ambiente en `cypress.config.js`.
2. Ejecuta `npm start` para abrir Cypress.
3. Selecciona **E2E testing**, el navegador y el `feature` que deseas ejecutar.

# Contribuir
¡Las contribuciones son bienvenidas! Revisa las pautas en [CONTRIBUTING.md](CONTRIBUTING.md) para saber cómo enviar *pull requests* y reportar problemas.

# Licencia
Este proyecto se distribuye bajo la licencia [ISC](LICENSE).

# Contacto
Para comentarios o preguntas puedes escribir a [jasp402@gmail.com](mailto:jasp402@gmail.com).
