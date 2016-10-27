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

export function querySingle(query: string, params: any[]) : Promise<any> {
    return connection().then(connection => {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err,res) => {
                connection.release();
                if (err) { console.info(err); reject(err); }
                else resolve(res);
            })
        });
    });
}