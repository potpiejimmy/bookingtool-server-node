import { Router, Request, Response, NextFunction } from "express";
import * as Projects from "../business/projects";

const projectsRouter: Router = Router();

projectsRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    if (request.query.managed) {
        /* getManagedProjects */
        Projects.getManagedProjects(request.user)
        .then(b => response.json(b))
        .catch(err => next(err));
    } else {
        /* getProjects */
        // TODO
    }
});

export { projectsRouter }
