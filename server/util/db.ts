import { IPool, IConnection, IError, createPool } from 'mysql';

var pool : IPool;

function getPool():IPool {
    if (!pool) {
        pool = createPool({
            connectionLimit : 10,
            host            : 'localhost',
            user            : 'bookingtool',
            password        : 'bookingtool',
            database        : 'bookingtool'
        });
    }
    return pool;
}

export function perform(action:(connection: IConnection)=>void) {
    getPool().getConnection((err: IError, connection: IConnection) => {
        if (err) { console.info(err); return; }
        action(connection);
    });
}
