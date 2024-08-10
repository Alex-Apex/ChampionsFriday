const sql = require('mssql');

// Configure the database connection using environment variables
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 1433),
    options: {
        encrypt: true, // Use encryption (recommended if you use Azure)
        enableArithAbort: true, // Terminate queries that result in overflow or divide-by-zero errors
    },
};

// Create a pool of connections to be reused
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
    sql, 
    poolPromise
};