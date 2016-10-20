import { Router, Request, Response, NextFunction } from "express";
import * as db from "../util/db";
import * as Domains from "./domains";

var asyncLoop = require('node-async-loop');

const templatesRouter: Router = Router();

/**
 * findBookingTemplates(String searchString)
 * 
 * Returns the list of templates matching the given search criteria
 * @param searchString a search string
     * @return list of matching templates
 */
templatesRouter.get("/", function (request: any, response: Response, next: NextFunction) {
   db.perform(connection => {
       Domains.getDomains(request.user).then(domains => {
            let templates = [];
            asyncLoop(domains, (i,next) => {
                if (!i) {next(); return;} // stupid asyncLoop loops over empty array
                connection.query("SELECT * FROM booking_template bt,budget b,project p WHERE bt.budget_id=b.id AND b.project_id=p.id AND p.domain_id=? AND bt.search_string LIKE ? AND bt.active = ? AND p.status=0", [
                    i.id, "%"+request.query.search.replace("*", "%").replace(" ", "%") +"%", 1
                ], (err, res) => {
                    console.info(res);
                    res.forEach(e => templates.push(e));
                    next();
                })
            }, err => { // completed loop
                connection.release();
                response.json(templates);
            });
       })
   });
});

export { templatesRouter }
