import { Router, Request, Response, NextFunction } from "express";
import * as Templates from "../business/templates";

const templatesRouter: Router = Router();

/**
 * findBookingTemplates(String searchString)
 */
templatesRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    Templates.findBookingTemplates(request.user, request.query.search)
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { templatesRouter }
