var wrapper = require('node-mysql-wrapper'); 
var mysql   = require('mysql');

var c;

export function connect() {
    var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'bookingtool',
    password : 'bookingtool',
    database : 'bookingtool'
    });

    c =  wrapper.wrap(connection);
}

export function connection() {
    return c;
}
