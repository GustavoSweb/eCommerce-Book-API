import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const connection = {
  client: "pg",
  connection: process.env.DATABASE_URL,
};
const db = knex(connection);

export default db;
