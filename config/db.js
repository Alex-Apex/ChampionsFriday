const sql = require("mssql");

const config = {
  user: "your_username",
  password: "your_password",
  server: "your_server",
  database: "your_database",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

sql
  .connect(config)
  .then((pool) => {
    if (pool.connecting) {
      console.log("Connecting to the database...");
    }
    if (pool.connected) {
      console.log("Connected to the database.");
    }
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
  });

module.exports = sql;
