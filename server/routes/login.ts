import { Router, Request, Response, NextFunction } from "express";
import * as Login from "../business/login";

const loginRouter: Router = Router();

loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    Login.login(request.body.user, request.body.password)
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { loginRouter }
