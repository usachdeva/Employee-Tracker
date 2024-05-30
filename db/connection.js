const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "hello2505??",
    database: "employees_db",
    port: 5432, //this one is for postgres
});

module.exports = pool;
