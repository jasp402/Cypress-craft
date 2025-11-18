# Proyecto: Cypress Test Workflows Dashboard (visual-testflow)

## 1. Visión General

`visual-testflow` es una herramienta de autoría visual (un artilugio) diseñada para operar dentro del proyecto `cypress-craft`. Su objetivo es proporcionar una capa visual, similar a n8n, para que los usuarios puedan construir, visualizar y ejecutar flujos de trabajo de pruebas de Cypress.

La herramienta no gestiona su propia instalación de Cypress, sino que utiliza la versión ya existente en el proyecto raíz (`cypress-craft`), que además está configurado para usar **Cucumber**. Por lo tanto, todos los escenarios de prueba se definen en archivos `.feature`.

## 2. Objetivo Principal

Crear una interfaz donde cada **nodo representa un archivo `.feature` existente** y los **edges** definen el orden de ejecución. El sistema debe permitir al usuario:

1.  **Descubrir y listar** los archivos `.feature` disponibles en el proyecto.
2.  **Arrastrar y soltar** estos features como nodos en un lienzo.
3.  **Conectar los nodos** para definir un flujo de ejecución secuencial.
4.  **Ejecutar el workflow**, lo que se traduce en la ejecución de los archivos `.feature` uno tras otro.
5.  **Visualizar el progreso** en tiempo real, actualizando el estado de cada nodo (idle, running, passed, failed).

## 3. Lógica de Ejecución (Simbólica)

La ejecución de un workflow es "simbólica". En lugar de ser un proceso monolítico, el backend orquesta la ejecución de Cypress para cada nodo:

-   Al presionar "Run Workflow", el backend recibe la estructura del flujo (nodos y edges).
-   Recorre los nodos en el orden definido.
-   Para cada nodo, invoca la API de Cypress para ejecutar el archivo `.feature` específico asociado a ese nodo. El comando subyacente es equivalente a `npx cypress run --spec path/to/your.feature`.
-   Los resultados (éxito, fallo, logs) se capturan y se emiten al frontend a través de WebSockets para actualizar la UI en tiempo real.

**Fase Futura:** Eventualmente, la herramienta podría generar un único archivo `.feature` temporal que combine los pasos de un workflow, pero el requisito inicial es ejecutar los features existentes de forma secuencial.

## 4. Tecnologías y Estructura

-   **Proyecto Raíz (`cypress-craft`)**: Provee `cypress` y la configuración de `cucumber`.
-   **`tools/_visual-testflow/package.json`**: Centraliza todas las dependencias y scripts para la herramienta.

### Frontend (Next.js)

El frontend está construido con **Next.js**, utilizando su **App Router**. Esto proporciona tanto el renderizado de la interfaz como un entorno de desarrollo integrado.

-   **Framework**: Next.js (React + TypeScript)
-   **Visualización de Nodos**: React Flow
-   **Estilos**: TailwindCSS
-   **Componentes UI**: Radix UI, shadcn/ui
-   **Animaciones**: Framer Motion
-   **Comunicación Real-Time**: `socket.io-client`

### Backend (Node.js)

El backend es un servidor **Node.js con Express** que se ejecuta de forma independiente y se encuentra en la carpeta `/server`. Su función principal es orquestar las ejecuciones de Cypress.

-   **Framework**: Node.js + Express
-   **Orquestación de Cypress**: Cypress Module API (`cypress.run()`)
-   **Comunicación Real-Time**: `socket.io`
-   **Paso de Datos (Opcional)**: Contexto en memoria para pasar outputs entre nodos.

## 5. Requisitos Funcionales Detallados

1.  **Nodo (`.feature`)**: Cada nodo debe mostrar el nombre del feature y tener estados visuales claros: `idle` (gris), `running` (azul), `passed` (verde), `failed` (rojo).
2.  **Panel Lateral**: Debe mostrar una lista de los archivos `.feature` detectados en el proyecto para que el usuario pueda arrastrarlos al lienzo.
3.  **Endpoint `/run-workflow`**: Recibe el JSON del flujo y comienza la orquestación de la ejecución.
4.  **Eventos de Socket.io**: El backend debe emitir eventos como `status-update` con `{ scenarioId, status, result }` para que el frontend reaccione.
5.  **Comando de Inicio**: `npm run dev` utiliza `concurrently` para levantar tanto el servidor de desarrollo de Next.js (`npm run dev:frontend`) como el servidor backend de Node.js (`npm run dev:backend`) al mismo tiempo.
