export const stepTemplates = {
  Given: [
    'la configuración del POM ha sido inicializada para {string}',
    'los datos de la tarjeta (opcional: {string})',
    'un correo temporal',
    'insertar registro en {word} db {dataTable}', // New step with dataTable
    'actualizar registro en {word} db',
    'Crear REFUNDS para todos los cargos listados',
  ],
  When: [
    'una petición {word} es enviada al endpoint {string}',
    'se muestre la {petición|respuesta} de {string}',
    'Consultar la base de datos {word}',
    'eliminar registro en {word} db',
    'Capturar evidencia de la pantalla',
  ],
  Then: [
    'la respuesta en {string} debe tener el parámetro {string} con la condición {string} y el valor {string}',
    'la respuesta en <service> debe tener el parámetro <parameters> con la condición <condition> y el valor <value>',
    'Esperar {word} {word}',
  ],
};
