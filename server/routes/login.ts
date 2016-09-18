import { Router, Request, Response, NextFunction } from "express";
import * as db from "../util/db";

const loginRouter: Router = Router();

loginRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    db.connection().ready(() => {
        db.connection().table("booking_template").findAll().then(result => {
            response.json(result);
        });
    })
});

export { loginRouter }
