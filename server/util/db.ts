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

export function connection(): Promise<IConnection> {
    return new Promise((resolve, reject) => {
        getPool().getConnection((err: IError, connection: IConnection) => {
            if (err) { console.info(err); reject(err); }
            else resolve(connection);
        });
    });
}

export function query(connection: IConnection, stmt: string, params: any[]) : Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query(stmt, params, (err,res) => {
            if (err) { console.info(err); reject(err); }
            else resolve(res);
        })
    });
}

export function querySingle(stmt: string, params: any[]) : Promise<any> {
    return connection().then(connection => query(connection, stmt, params).then(res => {
        connection.release();
        return res;
    }));
}