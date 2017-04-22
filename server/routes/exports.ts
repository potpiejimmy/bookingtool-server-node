import { Router, Request, Response, NextFunction } from "express";
import * as Exports from "../business/exports";

const exportsRouter: Router = Router();

/**
 * getExcelForName(String person, Integer weeksToExport)
 */
exportsRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    Exports.getExcelForName(request.user, request.query.weeks ? parseInt(request.query.weeks) : 1)
    .then(workbook => streamWorkbook(workbook, response))
    .catch(err => next(err));
});

/**
 * getExcelForProject(Integer projectToExport, Integer monthsToExport)
 */
exportsRouter.get("/project", function (request: any, response: Response, next: NextFunction) {
    Exports.getExcelForProject(request.user, request.query.id, request.query.months)
    .then(workbook => streamWorkbook(workbook, response))
    .catch(err => next(err));
});

function streamWorkbook(workbook: any, response: Response) {
    response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=export.xlsx");
    workbook.xlsx.write(response).then(()=>response.end());
}

export { exportsRouter }
