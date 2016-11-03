import { Router, Request, Response, NextFunction } from "express";
import * as Templates from "../business/templates";

const templatesRouter: Router = Router();

/**
 * findBookingTemplates(String searchString)
 */
templatesRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    if (request.query.search) {
        Templates.findBookingTemplates(request.user, request.query.search)
        .then(res => response.json(res))
        .catch(err => next(err));
    } else {
        Templates.getLastUsedByPerson(request.user, request.query.limit ? parseInt(request.query.limit) : null)
        .then(res => response.json(res))
        .catch(err => next(err));
    }
});

export { templatesRouter }
