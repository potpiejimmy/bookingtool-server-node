import { Router, Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as db from "../util/db";

const loginRouter: Router = Router();

loginRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    db.perform(connection => {
        connection.query("select * from booking_template", (err,res) => {
            connection.release();
            response.json(res);
        });
    })
});

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
    connection.query("select * from user_role where user_name=?", [user.name], (err,res) => {
        connection.release();
        user.roles = res;
        let token = jwt.sign(user, 'supersecret', {
            expiresIn: 10
        });
        response.json({token:token});
    });
}

export { loginRouter }
