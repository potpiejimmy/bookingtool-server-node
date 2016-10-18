import { Router, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as db from "../util/db";

const bookingsRouter: Router = Router();

bookingsRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    let token = jwt.decode(request.header('Authorization'));
    console.info("TOKEN: " + JSON.stringify(token));
    db.perform(connection => {
        connection.query("select * from booking where user_name=?", [token.name], (err,res) => {
            connection.release();
            response.json(res);
        });
    })
});

export { bookingsRouter }
