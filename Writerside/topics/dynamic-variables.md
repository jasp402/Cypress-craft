# ¿Cómo agregar variables dinámicas?

Las variables dinámicas son fundamentales en los casos de pruebas automatizados, ya que proporcionan flexibilidad, adaptabilidad, reusabilidad, datos realistas y completos, mejora la cobertura de pruebas y reducen la fragilidad de las pruebas, todo lo cual contribuye a la calidad y robustez de las automatizaciones.

## Configurar carpeta fixtures

### Archivo data.js

Aquí se definirán las variables dinámicas que se emplearán en la ejecución. La nomenclatura para nombrarlas será todo en mayúsculas y palabras separadas por guión bajo. Del mismo modo, tener en cuenta que la asignación de las mismas mantienen una jerarquía: #getDefaultData(), getEnvironmentSpecificData() y #getTypeSpecificData().

1. Para usar una variable dinámica para todos los ambientes y entornos, esta se debe agregar en el método #getDefaultData()
   ![CypresCraft](dynamicvardata_1.png){ width=800 }{border-effect=line}

2. En caso tener variables por cada tipo de ambiente de pruebas, estas se deben agregar en el método #getEnvironmentSpecificData()
   ![CypresCraft](dynamicvardata_2.png){ width=800 }{border-effect=line}

3. Si se requiere tomar el valor de una variable para un servicio específico, este se debe agregar en el método #getTypeSpecificData(). En la imagen a continuación se considerará a la variable USER_NAME solamente cuando se ejecute el servicio de commets y el ambiente de pruebas sea producción.
   ![CypresCraft](dynamicvardata_3.png){ width=800 }{border-effect=line}

## Configurar arpeta test

### Archivo feature

En los archivos features se encuentran los pasos de cada uno de los casos de pruebas a ejecutar. Cuando se requiera hacer uso de variables dinámicas se deben seguir los siguientes consejos:

1. Identificar el step donde se agrega la variable dinámica
   ![CypresCraft](dynamicvarfeature_1.png){ width=800 }{border-effect=line}

2. Agregar variable dinámica, tal cual como se nombró en el archivo data.js
   ![CypresCraft](dynamicvarfeature_2.png){ width=800 }{border-effect=line}

3. No olvidar mantener la nomenclatura de numeral (#) al inicio y al final de la variable, de lo contrario esta no será reconocida
   ![CypresCraft](dynamicvarfeature_3.png){ width=800 }{border-effect=line}

## Ejecución de automatizaciones con variables dinámicas

1. Consideraciones importantes

    a)  No es necesario declarar en cada método las variables dinámicas, se debe tener en cuenta el ambiente y servicio bajo la cual será empleada, de lo contrario cypressCraft arrojará que la variable está duplicada.
   ![CypresCraft](dynamicvarexecution_1a.png){ width=800 }{border-effect=line}
    
    b) Para corregir el error mencionado, es necesario eliminar o cambiar el nombre de la variable dinámica presente en #getDefaultData(), que también está duplicada en getEnvironmentSpecificData() o en #getTypeSpecificData()
   ![CypresCraft](dynamicvarexecution_1b.png){ width=800 }{border-effect=line}

    c) Si la variable por cada ambiente tiene el mismo valor, se recomienda asignarla en el método #getDefaultData()
   ![CypresCraft](dynamicvarexecution_1c.png){ width=800 }{border-effect=line}

    d) Confirmar en el archvio cypress.config.js el ambiente y entorno de pruebas para saber cuáles son las variables que serán empleadas en la ejecución.
   ![CypresCraft](dynamicvarexecution_1d.png){ width=800 }{border-effect=line}


2. Ejecutar desde la consola del editor el comando
    ```bash
        npm start
    ```
   ![CypresCraft](execution-automation-e2e_1.png){ width=800 }{border-effect=line}

3. Seleccionar la opción “E2E testing”
   ![CypresCraft](execution-automation-e2e_2.png){ width=800 }{border-effect=line}

4. Seleccionar el navegador. En esta interfaz se mostrarán todos los navegadores que tenga instalado la computadora de trabajo. Luego dar clic en botón verde.
   ![CypresCraft](execution-automation-e2e_3.png){ width=800 }{border-effect=line}

5. Elegir el nuevo feature de E2E
   ![CypresCraft](execution-automation-e2e_4.png){ width=800 }{border-effect=line}

6. Corroboramos ejecución exitosa del feature que incluye variables dinámicas

> **Información importante**
>
> En caso el navegador se quede cargando y no muestre nada, se debe actualizar (f5), si persiste, se debe eliminar la caché.
>
{style="note"}

![CypresCraft](dynamicvarexecution_6.png){ width=800 }{border-effect=line}