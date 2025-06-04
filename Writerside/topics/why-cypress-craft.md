# ¿Porque cypressCraft?

![CypresCraft Logo](cypress_craft_definition.png){ width=800 }{border-effect=line}

CypressCraft nace de la necesidad de contar con una herramienta que simplifique la automatización de pruebas sin perder la flexibilidad de Cypress. A diferencia de utilizar Cypress de forma aislada, esta librería combina buenas prácticas de distintas empresas de la industria y provee una configuración inicial lista para usar.

## Integración con Cucumber
- Permite describir escenarios en lenguaje natural (Gherkin), facilitando la colaboración entre perfiles técnicos y no técnicos.
- Los *step definitions* se integran con un Page Object Model orientado a reutilizar código y mantener pruebas más limpias.

## Estructura optimizada
CypressCraft organiza los proyectos en carpetas diferenciadas para API y E2E. Esta separación agiliza el mantenimiento y permite reutilizar la misma base de código en distintos tipos de pruebas.

## Soporte para múltiples entornos
La librería maneja URLs, credenciales y datos de prueba según el entorno especificado. Esto es vital para replicar con fidelidad ambientes de desarrollo, QA o producción.

## Datos dinámicos
Para escenarios que requieren valores generados en tiempo de ejecución, CypressCraft provee un sistema sencillo de variables dinámicas. Así se evita el uso de datos fijos que pueden quedar obsoletos.

## Reporte integrado
Al finalizar las pruebas se genera automáticamente un reporte HTML basado en *multiple-cucumber-html-reporter*. De esta forma es sencillo revisar los resultados en CI/CD o compartirlos con el equipo.

En conjunto, estas características permiten iniciar un proyecto de pruebas de manera rápida, manteniendo un estándar de calidad comparable al de herramientas de grandes compañías.
