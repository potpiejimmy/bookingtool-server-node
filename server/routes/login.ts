import { Router, Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as db from "../util/db";

const loginRouter: Router = Router();

loginRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    db.connection().ready(() => {
        db.connection().table("booking_template").findAll().then(result => {
            response.json(result);
        });
    })
});

loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    db.connection().ready(() => {
        db.connection().table("user").find({"name":request.body.user}).then(result => {
            let user = result[0];
            if (user && crypto.createHash('md5').update(request.body.password).digest("hex") == user.password) {
                console.info("Login successful");
                response.json(result);
            } else {
                response.json({"result": "Sorry, wrong password."});
            }
        });
    })
});

export { loginRouter }
