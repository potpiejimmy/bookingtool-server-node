import { Router, Request, Response, NextFunction } from "express";
import * as Users from "../business/users";

const usersRouter: Router = Router();

usersRouter.put("/", function (request: any, response: Response, next: NextFunction) {
    Users.changePassword(request.user, request.body.oldPassword, request.body.newPassword)
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { usersRouter }
