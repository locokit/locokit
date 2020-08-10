// Update with your config settings.

module.exports = {
  client: "pg",
  connection: "postgres://postgres:pouicpouic@localhost:5433/postgres",
  // connection: process.env.DATABASE_URL || { user: 'me', database: 'my_app' }
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts'
  },
};
