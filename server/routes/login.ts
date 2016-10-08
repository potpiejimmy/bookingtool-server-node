import { Router, Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
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
            connection.release();
            let user = res[0];
            if (user && crypto.createHash('md5').update(request.body.password).digest("hex") == user.password) {
                console.info("Login successful");
                response.json(user);
            } else {
                response.json({"result": "Sorry, wrong password."});
            }
        });
    })
});

export { loginRouter }
