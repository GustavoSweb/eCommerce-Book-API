import knex from "knex";

const connection = {
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "ecommercebook",
  },
};

const db = knex(connection);

export default db;
