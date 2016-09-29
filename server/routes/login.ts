import { Router, Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as db from "../util/db";

const loginRouter: Router = Router();

loginRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    db.perform(connection => {
        connection.table("booking_template").findAll().then(result => {
            response.json(result);
        });
    })
});

loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    db.perform(connection => {
        connection.table("user").findById(request.body.user).then(user => {
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
