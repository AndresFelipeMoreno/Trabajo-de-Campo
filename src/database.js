const mysql = require('mysql');
const {promisify} = require('util');
const{ database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((error, connection) =>{
    if (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (error.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) connection.release();
    console.log('Base de datos conectada');
    return;
});

//Convirtiendo en promesas lo que antes era callbacks

pool.query = promisify(pool.query);

module.exports = pool;