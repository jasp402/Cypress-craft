# ¿Cómo agregar un step definition?

## Configurar carpeta common

### Archivo stepDefinition.js

Este archivo interactúa con Cypress para definir pasos de prueba en lenguaje natural utilizando el preprocesador de Cucumber, y utiliza un objeto pageObject para encapsular la lógica de las pruebas y realizar acciones en la aplicación bajo prueba.

1. Definir si el nuevo step definition pertenece a pruebas API , E2E o si será usado en ambos tipos de proyectos.
   ![CypresCraft](howaddstepdefinition_1.png){ width=800 }{border-effect=line}
2. Agregar nuevo step definition, solo se admiten When, Then y Given
   ![CypresCraft](howaddstepdefinition_2.png){ width=800 }{border-effect=line}

### Lineamiento para asignar funciones

1. Si la función a incorporar será utilizada por más de una clase, se recomienda nombrarla con guión bajo. Estas mismas funciones deben estar declaradas en el archivo main.pom.js.
   ![CypresCraft](howaddguidelines_1_1.png){ width=800 }{border-effect=line}
   ![CypresCraft](howaddguidelines_1_2.png){ width=800 }{border-effect=line}
2. Si la función solo pertenece a una clase. La función se nombrará sin guión bajo. La misma que debe estar en el archivo correspondiente que contiene la clase en la carpeta pom.
   ![CypresCraft](howaddguidelines_2_1.png){ width=800 }{border-effect=line}
   ![CypresCraft](howaddguidelines_2_2.png){ width=800 }{border-effect=line}

## Configurar carpeta pom

### Archivo main.pom.js

1. Agregar la función que contiene la lógica relacionada con el step definition.
   ![CypresCraft](howaddmain_1.png){ width=800 }{border-effect=line}

## Vincular stepDefinition con feature

### Archivo feature

1. Agregar step definition en feature
   ![CypresCraft](howaddfeature_1.png){ width=800 }{border-effect=line}

2. Comprobar ejecución con step agregado
   ![CypresCraft](howaddfeature_2.png){ width=800 }{border-effect=line}