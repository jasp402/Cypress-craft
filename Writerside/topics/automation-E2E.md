# ¿Cómo automatizar E2E?

## Configurar carpeta fixtures

### Archivo url.js

En este archivo se podrán configurar las urls bases del proyecto E2E. Así mismo, se podrá asignar una o más urls por cada ambiente de trabajo (dev, qa, pro).

1. Agregar url base de la web, por ejemplo:
   https://www.saucedemo.com
   ![CypresCraft](e2eurls_1.png){ width=800 }{border-effect=line}

2. Agregar endpoint para Products
   ![CypresCraft](e2eurls_2.png){ width=800 }{border-effect=line}

3. ¿Qué pasa si tengo más de una url base?
    a. Agregar url al ambiente correspondiente en formato array
   ![CypresCraft](e2eurls_3a.png){ width=800 }{border-effect=line}

    b. Seleccionar el index de la url correspondiente en los endpoints
   ![CypresCraft](e2eurls_3b.png){ width=800 }{border-effect=line}

### Archivo data.js

Este archivo contiene una clase llamada Data que se utiliza para gestionar datos específicos del entorno y del tipo en un proyecto de cypress-craft. Es importante destacar que el constructor toma un parámetro environment, que se espera que sea un array. Asigna el primer elemento del array a this.env y evalúa si el segundo elemento es 'live', en cuyo caso asigna true a this.live; de lo contrario, asigna false. Esto en caso se quiera trabajar con entornos por cada ambiente (dev, qa, pro).

1. Agregar a SERVICES_LIST un nuevo servicio
   ![CypresCraft](e2edata_1.png){ width=800 }{border-effect=line}

2. Agregar lista de condicionales que serán usadas en los features
   ![CypresCraft](e2edata_2.png){ width=800 }{border-effect=line}

## Configurar carptea settings

### Archivo helpers.js

Este archivo contiene funciones utilitarias que son utilizadas para manipular datos dinámicos, verificar si los datos son dinámicos y realizar afirmaciones en elementos durante las pruebas de extremo a extremo. Estas funciones ayudan a escribir pruebas más dinámicas y robustas al interactuar con datos variables y elementos de la interfaz de usuario.

1. Confirmar relación entre las condicionales y las aserciones.

   ![CypresCraft](e2ehelpers_1.png){ width=800 }{border-effect=line}

## Configurar carpeta pom

### Archivo pom.js

Este archivo define una clase que encapsula elementos y acciones relacionadas con la página de productos en una aplicación web, y proporciona métodos para interactuar con estos elementos durante las pruebas de automatización de Cypress.

1. Crear archivo que contiene la clase en la carpeta “e2e”. Se recomienda mantener la nomenclatura “e2e.02-products.pom.js”
   ![CypresCraft](e2epom_1.png){ width=800 }{border-effect=line}

2. Configurar la clase del archivo pom.js
a. Definir los elementos que forman parte del DOM de la plataforma web
   ![CypresCraft](e2epom_2a.png){ width=800 }{border-effect=line}

b. Agregar las funciones que están vinculadas con el archivo stepDefinition.js
   ![CypresCraft](e2epom_2b.png){ width=800 }{border-effect=line}

c. No olvidar exportar la clase de la siguiente manera
   export default new Clase();
   ![CypresCraft](e2epom_2c.png){ width=800 }{border-effect=line}

### Archivo index.js

Este archivo actúa como un punto de acceso centralizado para diferentes partes de la automatización de pruebas, permitiendo que otros módulos o clases accedan fácilmente a funcionalidades específicas relacionadas con publicaciones, comentarios, inicio de sesión y productos. Esto ayuda a organizar y estructurar el código de automatización de pruebas de manera modular y fácilmente mantenible.

1. Importar la clase users del archivo e2e.02-products.pom.js
   ![CypresCraft](e2eindex_1.png){ width=800 }{border-effect=line}

2. Exportar la clase desde index.js
   ![CypresCraft](e2eindex_2.png){ width=800 }{border-effect=line}

## Configurar carpeta test

### Archivo feature

Este archivo describe una característica de prueba utilizando el formato Gherkin, que es un lenguaje de dominio específico para escribir pruebas de comportamiento de software de manera estructurada y legible. Aquí se detallan los casos de prueba y los pasos a seguir para validar una funcionalidad o característica en específico. 

1. Crear archivo feature en la carpeta “e2e”, de ser el caso, crear una subcarpeta para mantener un mejor orden. Se recomienda nombrar al archivo de la siguiente manera “e2e.02-products.feature”.
   ![CypresCraft](e2efeature_1.png){ width=800 }{border-effect=line}

2. Configurar archivo feature de products
   ![CypresCraft](e2efeature_2.png){ width=800 }{border-effect=line}

3. En caso haber seleccionado idioma español, se debe considerar esta línea de código al inicio del archivo
   ```bash
    # language: es
   ```
   ![CypresCraft](e2efeature_3.png){ width=800 }{border-effect=line}
