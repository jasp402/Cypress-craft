// cypress/settings/db-settings.js

/**
 * Este módulo centraliza la lógica para interactuar con diferentes bases de datos SQL.
 * Utiliza los drivers de base de datos instalados en el proyecto (ej: 'pg', 'mysql2', 'sqlite3').
 * La configuración de la conexión se obtiene del archivo cypress.config.js.
 */

const dbDrivers = {
  postgres: require('pg'),
  mysql: require('mysql2/promise'),
  sqlite: require('sqlite3'),
};

let activeConnection = null;

/**
 * Ejecuta una consulta en la base de datos configurada.
 * La configuración se extrae de `Cypress.config('db')`.
 *
 * @param {string} query - La consulta SQL a ejecutar.
 * @param {object} dbConfig - La configuración de la BD desde cypress.config.js.
 * @returns {Promise<any>} - El resultado de la consulta.
 */
async function queryDatabase(query, dbConfig) {
  if (!dbConfig || !dbConfig.driver) {
    throw new Error("La configuración de la base de datos ('db') no está definida en cypress.config.js o no tiene un 'driver'.");
  }

  const { driver, ...connectionConfig } = dbConfig;

  if (!dbDrivers[driver]) {
    throw new Error(`Driver de base de datos no soportado: '${driver}'. Soportados: ${Object.keys(dbDrivers).join(', ')}`);
  }

  try {
    if (driver === 'postgres') {
      const pool = new dbDrivers.postgres.Pool(connectionConfig);
      const result = await pool.query(query);
      await pool.end();
      return result.rows;
    }

    if (driver === 'mysql') {
      const connection = await dbDrivers.mysql.createConnection(connectionConfig);
      const [rows] = await connection.execute(query);
      await connection.end();
      return rows;
    }

    if (driver === 'sqlite') {
      // SQLite es basado en archivo, la conexión es diferente.
      return new Promise((resolve, reject) => {
        const db = new dbDrivers.sqlite.Database(connectionConfig.database, (err) => {
          if (err) return reject(err);
        });
        db.all(query, [], (err, rows) => {
          db.close();
          if (err) return reject(err);
          resolve(rows);
        });
      });
    }
  } catch (error) {
    console.error('Error ejecutando la consulta en la base de datos:', error);
    throw error;
  }
}

module.exports = { queryDatabase };