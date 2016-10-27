import { Router, Request, Response, NextFunction } from "express";
import * as Budgets from "../business/budgets";

const budgetsRouter: Router = Router();

/**
 * getBudgetInfo(id)
 */
budgetsRouter.get("/:id", function (request: any, response: Response, next: NextFunction) {
    Budgets.getBudgetInfo(parseInt(request.params.id))
    .then(b => response.json(b))
    .catch(err => next(err));
});

export { budgetsRouter }
