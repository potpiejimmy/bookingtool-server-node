import { Router, Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";

const loginRouter: Router = Router();

loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    db.perform(connection => {
        connection.query("select * from user where name=?",[request.body.user], (err,res)  => {
            let user = res[0];
            if (user && crypto.createHash('md5').update(request.body.password).digest("hex") == user.password) {
                console.info("Login successful");
                authenticate(connection, user, response);
            } else {
                connection.release();
                response.json({"result": "Sorry, wrong password."});
            }
        });
    })
});

function authenticate(connection, user, response: Response) {
    connection.query("select role from user_role where user_name=?", [user.name], (err,res) => {
        connection.release();
        let roles = [];
        res.forEach(e => roles.push(e.role));
        user.roles = roles;
        let token = auth.createToken(user);
        response.json({token:token});
    });
}

export { loginRouter }
