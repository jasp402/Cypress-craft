# ¿Porque cypressCraft?

![CypresCraft Logo](cypress_craft_definition.png){ width=800 }{border-effect=line}

**CypressCraft: Revolucionando la Automatización de Pruebas en Desarrollo Web**
En el dinámico entorno del desarrollo web, la eficiencia y precisión en las pruebas automatizadas son vitales. Aquí es donde CypressCraft emerge como una solución innovadora, redefiniendo el panorama de la automatización de pruebas. Esta librería de NPM no oficial, es una versión personalizada y enriquecida de Cypress, un framework de vanguardia para pruebas de aplicaciones web.


<chapter title="Integración con cucumber" id="default-chapter-id">
<procedure id="default-chapter-id2" type="choices">
<p style="text-align: justify;">CypressCraft eleva la experiencia del usuario al integrar Cucumber, una herramienta que permite escribir pruebas en un lenguaje de alto nivel, cercano al lenguaje humano. Esta integración posibilita la creación de especificaciones de prueba legibles y mantenibles, facilitando la colaboración entre desarrolladores, QA engineers y partes no técnicas del equipo.</p>
   <step>Do this.</step>
   <step>Do that.</step>
   <p>Congratulation! You've added something.</p>
</procedure>
</chapter>


## Estructura Optimizada
Una de las fortalezas de CypressCraft es su estructura meticulosamente diseñada para pruebas de API y servicios. La herramienta proporciona un marco robusto y flexible que permite a los usuarios crear y ejecutar pruebas de backend con la misma eficacia y facilidad que las pruebas de frontend.

## Patrón de Diseño POM
El uso del patrón de diseño POM en CypressCraft representa un gran avance. Este patrón estructura las pruebas de una manera que reduce el duplicado de código y mejora la mantenibilidad. Los objetos de página actúan como intermediarios entre las pruebas y el código de la aplicación, haciendo que los cambios en la interfaz de usuario sean menos disruptivos para las pruebas automatizadas.

## Múltiples Entornos 
CypressCraft brilla en su capacidad para manejar múltiples entornos de prueba y datos dinámicos. Esta característica es esencial para simular diversas condiciones de prueba, asegurando que las aplicaciones se comporten como se espera en diferentes configuraciones y con distintos conjuntos de datos.

## Datos Dinámicos

## Multi-lenguaje
La librería ha sido diseñada con un enfoque en la gestión eficiente de APIs. Esto significa que los usuarios pueden esperar una experiencia de prueba más fluida y eficiente cuando se trata de validar y verificar las APIs, un componente crucial en el desarrollo de aplicaciones modernas.

## Ejemplos reales
La librería ha sido diseñada con un enfoque en la gestión eficiente de APIs. Esto significa que los usuarios pueden esperar una experiencia de prueba más fluida y eficiente cuando se trata de validar y verificar las APIs, un componente crucial en el desarrollo de aplicaciones modernas.

## Reporte integrado
La librería ha sido diseñada con un enfoque en la gestión eficiente de APIs. Esto significa que los usuarios pueden esperar una experiencia de prueba más fluida y eficiente cuando se trata de validar y verificar las APIs, un componente crucial en el desarrollo de aplicaciones modernas.


---


## Write content
%product% supports two types of markup: Markdown and XML.
When you create a new help article, you can choose between two topic types, but this doesn't mean you have to stick to a single format.
You can author content in Markdown and extend it with semantic attributes or inject entire XML elements.

## Inject XML
For example, this is how you inject a procedure:

<procedure title="Inject a procedure" id="inject-a-procedure">
    <step>
        <p>Start typing and select a procedure type from the completion suggestions:</p>
        <img src="completion_procedure.png" alt="completion suggestions for procedure" border-effect="line"/>
    </step>
    <step>
        <p>Press <shortcut>Tab</shortcut> or <shortcut>Enter</shortcut> to insert the markup.</p>
    </step>
</procedure>

## Add interactive elements

### Tabs
To add switchable content, you can make use of tabs (inject them by starting to type `tab` on a new line):

<tabs>
    <tab title="Markdown">
        <code-block lang="plain text">![Alt Text](new_topic_options.png){ width=450 }</code-block>
    </tab>
    <tab title="Semantic markup">
        <code-block lang="xml">
            <![CDATA[<img src="new_topic_options.png" alt="Alt text" width="450px"/>]]></code-block>
    </tab>
</tabs>

### Collapsible blocks
Apart from injecting entire XML elements, you can use attributes to configure the behavior of certain elements.
For example, you can collapse a chapter that contains non-essential information:

#### Supplementary info {collapsible="true"}
Content under such header will be collapsed by default, but you can modify the behavior by adding the following attribute:
`default-state="expanded"`

### Convert selection to XML
If you need to extend an element with more functions, you can convert selected content from Markdown to semantic markup.
For example, if you want to merge cells in a table, it's much easier to convert it to XML than do this in Markdown.
Position the caret anywhere in the table and press <shortcut>Alt+Enter</shortcut>:

<img src="convert_table_to_xml.png" alt="Convert table to XML" width="706" border-effect="line"/>

## Feedback and support
Please report any issues, usability improvements, or feature requests to our
<a href="https://youtrack.jetbrains.com/newIssue?project=WRS">YouTrack project</a>
(you will need to register).

You are welcome to join our
<a href="https://join.slack.com/t/writerside/shared_invite/zt-1hnvxnl0z-Nc6RWXTppRI2Oc566vumYw">public Slack workspace</a>.
Before you do, please read our [Code of conduct](https://plugins.jetbrains.com/plugin/20158-writerside/docs/writerside-code-of-conduct.html).
We assume that you’ve read and acknowledged it before joining.

You can also always send an email to [writerside@jetbrains.com](mailto:writerside@jetbrains.com).

<seealso>
    <category ref="wrs">
        <a href="https://plugins.jetbrains.com/plugin/20158-writerside/docs/markup-reference.html">Markup reference</a>
        <a href="https://plugins.jetbrains.com/plugin/20158-writerside/docs/manage-table-of-contents.html">Reorder topics in the TOC</a>
        <a href="https://plugins.jetbrains.com/plugin/20158-writerside/docs/local-build.html">Build and publish</a>
        <a href="https://plugins.jetbrains.com/plugin/20158-writerside/docs/configure-search.html">Configure Search</a>
    </category>
</seealso>