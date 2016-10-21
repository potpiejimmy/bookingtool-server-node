import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";

export function login(user: string, password: string): Promise<any> {
    return new Promise((resolve,reject) => {
        db.perform(connection => {
            connection.query("select * from user where name=?",[user], (err,res)  => {
                let user = res[0];
                if (user && crypto.createHash('md5').update(password).digest("hex") == user.password) {
                    console.info("Login successful");
                    authenticate(connection, user, resolve);
                } else {
                    connection.release();
                    resolve({"result": "Sorry, wrong password."});
                }
            });
        })
    });        
}

function authenticate(connection, user, resolve) {
    connection.query("select role from user_role where user_name=?", [user.name], (err,res) => {
        connection.release();
        let roles = [];
        res.forEach(e => roles.push(e.role));
        user.roles = roles;
        let token = auth.createToken(user);
        resolve({token:token});
    });
}
