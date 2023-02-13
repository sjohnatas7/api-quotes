// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
*/
const path = require('path')

const { db } = require('./.env')
module.exports = {
  development:{
    client: 'postgresql',
    connection: db.development,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  test: {
    client: 'postgresql',
    connection: db.test,
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
