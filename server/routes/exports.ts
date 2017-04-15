import { Router, Request, Response, NextFunction } from "express";
import * as Exports from "../business/exports";

const exportsRouter: Router = Router();

/**
 * getExcelForName(String person, Integer weeksToExport)
 */
exportsRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    Exports.getExcelForName(request.user, 2)
    .then(workbook => {
        response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=" + "bookingstest.xlsx");
        workbook.xlsx.write(response).then(()=>response.end());
    })
    .catch(err => next(err));
});

export { exportsRouter }
