const mysql = require("mysql2/promise");
const config = require("../config/db-config");


var connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

module.exports.connection = connection;