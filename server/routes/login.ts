import { Router, Request, Response, NextFunction } from "express";

const loginRouter: Router = Router();

loginRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
        response.json([{
            name: 'Test',
            mail: 'salty@whatever.com'
        },{
            name: 'Thorsten',
            mail: 'yeahbaby@gibtsnicht.nix'
        }]);
});

export { loginRouter }
