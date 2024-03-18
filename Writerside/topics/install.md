# ¿Cómo instalar cypressCraft?

Sigue estos pasos para instalar CypressCraft y comenzar a aprovechar sus potentes características para pruebas automatizadas:

1. Crear una carpeta y abrir esta nueva carpeta desde el editor de código
   ![CypresCraft](install_1.png){ width=800 }{border-effect=line}
2. Abrir la consola del editor de código e inicializar proyecto Node.js con el siguiente comando: npm init -y
   ![CypresCraft](install_2.png){ width=800 }{border-effect=line}
3. Verificar creación de archivo “package.json”
   ![CypresCraft](install_3.png){ width=800 }{border-effect=line}
4. Instalar cypress-craft en el proyecto con npm i cypress-craft
   ![CypresCraft](install_4.png){ width=800 }{border-effect=line}
5. Corroborar creación de carpeta “node-modules” y de archivo “package-lock.json”
   ![CypresCraft](install_5.png){ width=800 }{border-effect=line}
6. Configurar cypress-craft de acuerdo a las necesidades del proyecto con el siguiente comando: npx cypress-craft-init. Es importante conocer que cada opción que se le elija en adelante no hay forma de retroceder para volver a configurar.
   ![CypresCraft](install_6.png){ width=800 }{border-effect=line}
7. Seleccionar el idioma para BDD del proyecto, esta configuración solo afecta los features y al archivo stepDefinition.js
   ![CypresCraft](install_7.png){ width=800 }{border-effect=line}
8. Seleccionar el tipo de proyecto:

   a) E2E: relacionado con pruebas de frontend

   b) API: relacionado con pruebas para backend

   c) E2E + API: proyecto híbrido que mezcla ambos tipos de pruebas.
   ![CypresCraft](install_8.png){ width=800 }{border-effect=line}
9. Seleccionar si en caso se desea incluir reportes ingresar “Y”, de lo contrario “n”.
   ![CypresCraft](install_9.png){ width=800 }{border-effect=line}
10. Verificar creación de carpeta “cypress”
    ![CypresCraft](install_10.png){ width=800 }{border-effect=line}
11. Configurar script en package.json para ejecutar proyecto (opcional). Se debe agregar la siguiente línea de código: "start": "cypress open". Recuerda incluir la coma al final y guardar cambios.
    ![CypresCraft](install_11.png){ width=800 }{border-effect=line}
12. Comprobar funcionalidad de cypress-craft con ejemplos bases que ya vienen incluídos. Ejecutar desde la consola del editor el comando npm start
    ![CypresCraft](install_12.png){ width=800 }{border-effect=line}
13. Seleccionar la opción “E2E testing” propia de cypress, esta misma opción se debe seleccionar así sea un proyecto tipo API.
    ![CypresCraft](install_13.png){ width=800 }{border-effect=line}
14. Seleccionar el navegador. En esta interfaz se mostrarán todos los navegadores que tenga instalado la computadora de trabajo. Luego dar clic en botón verde.
    ![CypresCraft](install_14.png){ width=800 }{border-effect=line}
15. Elegir primer feature de API
    ![CypresCraft](install_15.png){ width=800 }{border-effect=line}
16. Corroboramos ejecución exitosa del feature de API
    ![CypresCraft](install_16.png){ width=800 }{border-effect=line}
17. Para volver a listar los features del proyecto se debe dar clic en “Specs”
    ![CypresCraft](install_17.png){ width=800 }{border-effect=line}
18. Seleccionar el primer feature de E2E
    ![CypresCraft](install_18.png){ width=800 }{border-effect=line}
19. Corroboramos ejecución exitosa del feature de E2E
    ![CypresCraft](install_19.png){ width=800 }{border-effect=line}