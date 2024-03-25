# ¿Cómo automatizar endpoints / APIs?

## Configurar carpeta fixtures

### Archivo urls.js

En este archivo se podrán configurar las urls bases del proyecto API. Así mismo, se podrá asignar una o más urls por cada ambiente de trabajo (dev, qa, pro) y los end points correspondiente a cada petición.

1. Agregar url base de la API, por ejemplo:
https://jsonplaceholder.typicode.com
   ![CypresCraft](apiurl_1.png){ width=800 }{border-effect=line}

2. Agregar endpoint para Users
   ![CypresCraft](apiurl_2.png){ width=800 }{border-effect=line}

3. ¿Qué pasa si tengo más de una url base?

    a. Agregar url al ambiente correspondiente en formato array
   ![CypresCraft](apiurl_3a.png){ width=800 }{border-effect=line}

    b. Seleccionar el index de la url correspondiente en los endpoints
   ![CypresCraft](apiurl_3b.png){ width=800 }{border-effect=line}

### Archivo data.js

Este archivo contiene una clase llamada Data que se utiliza para gestionar datos específicos del entorno y del tipo en un proyecto de cypress-craft. Es importante destacar que el constructor toma un parámetro environment, que se espera que sea un array. Asigna el primer elemento del array a this.env y evalúa si el segundo elemento es 'live', en cuyo caso asigna true a this.live; de lo contrario, asigna false. Esto en caso se quiera trabajar con entornos por cada ambiente (dev, qa, pro).

1. Agregar a SERVICES_LIST un nuevo servicio
   ![CypresCraft](apidata_1.png){ width=800 }{border-effect=line}

2. Agregar la data específica al end point, esta puede ser por cada ambiente por ejemplo headers y body para producción
   ![CypresCraft](apidata_2.png){ width=800 }{border-effect=line}

## Configurar carpeta pom

### Archivo pom.js

Este archivo proporciona una abstracción para enviar solicitudes HTTP a diferentes endpoints de una API, permitiendo la reutilización del código y la fácil configuración de las solicitudes.

1. Crear archivo que contiene la clase del endpoint en la carpeta “api”. Se recomienda mantener la nomenclatura “api.03-users.pom.js”
   ![CypresCraft](apipom_1.png){ width=800 }{border-effect=line}

2. Configurar la clase del archivo pom.js
   ![CypresCraft](apipom_2_1.png){ width=800 }{border-effect=line}
   ![CypresCraft](apipom_2_2.png){ width=800 }{border-effect=line}

### Archivo index.js

Este archivo actúa como un punto de acceso centralizado para diferentes partes de la automatización de pruebas, permitiendo que otros módulos o clases accedan fácilmente a funcionalidades específicas relacionadas con publicaciones, comentarios, inicio de sesión y productos. Esto ayuda a organizar y estructurar el código de automatización de pruebas de manera modular y fácilmente mantenible.

1. Importar la clase users del archivo api.03-users.pom.js
   ![CypresCraft](apiindex_1.png){ width=800 }{border-effect=line}

2. Exportar la clase desde index.js
   ![CypresCraft](apiindex_2.png){ width=800 }{border-effect=line}

## Configurar carpeta test

### Archivo feature

Este es un archivo de definiciones de pruebas escritas en Gherkin, un lenguaje de dominio específico para describir el comportamiento del software de manera comprensible tanto para los desarrolladores como para los no técnicos. Aquí se describen casos de prueba específicos para probar diferentes funcionalidades del Endpoints relacionados a una API utilizando un lenguaje natural.

1. Crear archivo feature relacionado con el endpoint en la carpeta “api”, de ser el caso, crear una subcarpeta para mantener un mejor orden. Se recomienda nombrar al archivo de la siguiente manera “api.03-users.feature”.
   ![CypresCraft](apifeature_1.png){ width=800 }{border-effect=line}

2. Configurar archivo feature de users
   ![CypresCraft](apifeature_2.png){ width=800 }{border-effect=line}

3. En caso haber seleccionado idioma español, se debe considerar esta línea de código al inicio del archivo 
   ```bash
    # language: es
   ```
   ![CypresCraft](apifeature_3.png){ width=800 }{border-effect=line}
