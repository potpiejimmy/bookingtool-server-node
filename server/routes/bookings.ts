import { Router, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as db from "../util/db";

var asyncLoop = require('node-async-loop');

const bookingsRouter: Router = Router();

bookingsRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    let token = jwt.decode(request.header('Authorization'));
    db.perform(connection => {
        connection.query("select * from booking where person=? and day=?", [token.name, new Date(request.body.day)], (err,res) => {
            asyncLoop(res, (i,next) => {
                if (!i) {next(); return;} // stupid asyncLoop loops over empty array
                connection.query("select * from booking_template where id=?", [i.booking_template_id], (err,res) => {
                    i.booking_template = res[0];
                    next();
                })
            }, err => { // completed loop
                connection.release();
                console.info(JSON.stringify(res));
                response.json(res);
            });
        });
    })
});

export { bookingsRouter }
