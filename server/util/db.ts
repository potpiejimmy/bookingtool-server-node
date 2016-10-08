var mysql = require('mysql');

var pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            connectionLimit : 10,
            host            : 'localhost',
            user            : 'bookingtool',
            password        : 'bookingtool',
            database        : 'bookingtool'
        });
    }
    return pool;
}

export function perform(action) {
    getPool().getConnection((err,connection) => {
        if (err) { console.info(err); return; }
        action(connection);
    });
}
