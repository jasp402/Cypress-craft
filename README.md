<div style="background: #e3f5ec;" align="center">
    <img src="https://github.com/jasp402/Cypress-craft/assets/8978470/f75a5260-d16c-437a-978d-0da5e5bb5759" width="1024" alt="CypressCraft Logo">
</div>


# 📦 CypressCraft
> _We had fun creating this app. So you can have fun trying._

# What is CypressCraft?
It is a library for **[nodeJS](https://nodejs.org/en)** distributed via **[NPM](https://www.npmjs.com/package/cypress-craft)**. In essence, it is a **[Cypress](https://www.cypress.io/)** extension _(unofficial - created by the community)_. Which concentrates the best practices of E2E testing and API services: multiple libraries, design patterns and code organization.
This library is characterized by the integration of BDD using Cucumber and Gherkin, advanced design patterns such as Page Object Model (POM) and Factory Pattern, and Singleton Pattern specifically adapted and refined to work with the versatile nature of Cypress.


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


# Table of Contents
- [Introduction](#Introduction)
- [Characteristics](#Characteristics)
- [Requirements](#Requirements)
- [installation](#installation)
- Setting
- Use
- Implemented Design Patterns
- Environment Management
- Data Management
- Contribute
- License
- Contact
- Introduction

# Introduction
Welcome to CypressCraft, an advanced sub-framework designed to revolutionize the way E2E and API testing is performed using Cypress. Developed by a team with more than four years of experience at Cypress, this sub-framework emerges as a comprehensive solution to overcome common challenges in test automation and maximize efficiency in software development.

CypressCraft extends Cypress' capabilities beyond its primary focus on E2E testing, tailoring it for optimal performance in API testing. With meticulous integration of design patterns such as the Page Object Model (POM) and Factory Pattern, CypressCraft not only simplifies the creation of automated tests but also makes them more maintainable and scalable.

This sub-framework is specially designed for teams looking for agility and precision in their testing, offering advanced features such as handling multiple environments, data centralization, and flexibility to adjust to API or frontend projects. Whether you're just getting started with Cypress or are an automated testing veteran, CypressCraft is here to enrich your experience and take your testing to the next level.



# Characteristics
CypressCraft está equipado con una serie de características potentes y optimizaciones diseñadas para hacer que tus pruebas sean más eficientes y efectivas. Aquí hay una mirada a las principales características que hacen de CypressCraft una herramienta indispensable para la automatización de pruebas:

Optimización para Pruebas de API con Cypress: A pesar de que Cypress se centra principalmente en pruebas E2E, CypressCraft lo extiende para proporcionar soporte robusto y eficiente para pruebas de API.

Integración de Patrones de Diseño Avanzados: Implementamos patrones de diseño como POM y Factory Pattern para estructurar mejor las pruebas, mejorar la reutilización del código y facilitar el mantenimiento.

Manejo de Múltiples Ambientes: CypressCraft permite una fácil configuración y transición entre diferentes entornos de prueba, lo que lo hace ideal para pruebas en etapas de desarrollo, pruebas y producción.

Centralización de Datos: Ofrecemos una solución centralizada para gestionar tanto datos dinámicos como fijos, lo que aumenta la eficiencia y reduce la redundancia.

Adaptabilidad para Frontend y API: Diseñado para ser flexible, CypressCraft se adapta automáticamente a proyectos de API o frontend, lo que permite a los equipos concentrarse en la lógica de prueba sin preocuparse por la configuración de la herramienta.

Interfaz de Usuario Intuitiva y Documentación Completa: CypressCraft no solo es potente sino también fácil de usar, con una interfaz intuitiva y documentación completa que guía a los usuarios a través de todas sus funcionalidades.

Compatibilidad con la Última Versión de Cypress: Nos mantenemos al día con las últimas actualizaciones de Cypress, asegurando que los usuarios de CypressCraft siempre tengan acceso a las últimas características y mejoras en seguridad.


# Requirements
Para aprovechar al máximo las capacidades de CypressCraft, es importante asegurarse de que tu sistema cumpla con los siguientes requisitos previos:

Cypress Versión Compatible: CypressCraft está diseñado para funcionar con las versiones más recientes de Cypress. Asegúrate de tener instalada la última versión de Cypress en tu sistema.

Node.js y npm: Dado que Cypress es una herramienta basada en Node.js, necesitarás tener Node.js y npm (Node Package Manager) instalados. Recomendamos usar la versión LTS (Long Term Support) más reciente de Node.js.

Navegadores Compatibles: Para pruebas E2E, asegúrate de tener instalados los navegadores compatibles con Cypress, como Chrome, Firefox, Edge, entre otros.

Entorno de Desarrollo: Un entorno de desarrollo adecuado para JavaScript/TypeScript, con editores como Visual Studio Code, Sublime Text o Atom, es recomendable para una mejor experiencia de codificación.

Conocimientos Básicos: Un entendimiento básico de Cypress, pruebas E2E, y pruebas de API es beneficioso para utilizar efectivamente CypressCraft.


# installation
Sigue estos pasos para instalar CypressCraft en tu proyecto y comenzar a aprovechar sus potentes características para pruebas automatizadas:

Instalar Cypress:
Antes de instalar CypressCraft, asegúrate de tener Cypress instalado en tu proyecto. Si aún no lo has hecho, puedes instalar Cypress con npm ejecutando el siguiente comando en tu terminal:

bash
Copy code
npm install cypress --save-dev
Agregar CypressCraft:
Una vez que Cypress esté instalado, puedes agregar CypressCraft a tu proyecto. Ejecuta el siguiente comando para instalar CypressCraft:

bash
Copy code
npm install cypresscraft --save-dev
Este comando añadirá CypressCraft como una dependencia de desarrollo en tu proyecto.

Verificar la Instalación:
Tras la instalación, puedes verificar que CypressCraft se haya instalado correctamente revisando tu archivo package.json o ejecutando el siguiente comando:

bash
Copy code
npm list --depth=0
Configuración Inicial:
Para la configuración inicial, puedes seguir las instrucciones proporcionadas en la sección Configuración de este documento.

bash
Copy code
# Ejemplo de comando de instalación
npm install tu-sub-framework
Configuración
Explica cómo configurar el sub-framework después de la instalación. Incluye detalles sobre archivos de configuración, variables de entorno, etc.

# Uso
Ofrece ejemplos de cómo usar el sub-framework para diferentes casos de uso (E2E, API). Puedes incluir fragmentos de código o enlaces a ejemplos más detallados.

# Patrones de Diseño Implementados
Detalla los patrones de diseño utilizados y cómo estos benefician al usuario del sub-framework.

# Manejo de Entornos
Describe cómo el sub-framework gestiona múltiples entornos de prueba y cualquier configuración relacionada.

# Manejo de Datos
Explica cómo se centralizan y gestionan los datos, tanto dinámicos como fijos, dentro del sub-framework.

# Contribuir
Invita a otros a contribuir al proyecto y explica cómo pueden hacerlo. Puedes incluir instrucciones para realizar pull requests, normas de codificación, etc.

# Licencia
Indica la licencia bajo la cual se distribuye el sub-framework.

# Contacto
Proporciona información de contacto o enlaces a perfiles de redes sociales o profesionales para aquellos que deseen comunicarse contigo.
