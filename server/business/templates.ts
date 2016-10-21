import * as db from "../util/db";
import * as Domains from "./domains";

var asyncLoop = require('node-async-loop');

/**
 * findBookingTemplates(String searchString)
 * 
 * Returns the list of templates matching the given search criteria
 * @param searchString a search string
     * @return list of matching templates
 */
export function findBookingTemplates(user: any, searchString: string): Promise<any> {
    return new Promise((resolve,reject) => {
        db.perform(connection => {
            Domains.getDomains(user).then(domains => {
                    let templates = [];
                    asyncLoop(domains, (i,next) => {
                        if (!i) {next(); return;} // stupid asyncLoop loops over empty array
                        connection.query("SELECT * FROM booking_template bt,budget b,project p WHERE bt.budget_id=b.id AND b.project_id=p.id AND p.domain_id=? AND bt.search_string LIKE ? AND bt.active = ? AND p.status=0", [
                            i.id, "%"+searchString.replace("*", "%").replace(" ", "%") +"%", 1
                        ], (err, res) => {
                            res.forEach(e => templates.push(e));
                            next();
                        })
                    }, err => { // completed loop
                        connection.release();
                        resolve(templates);
                    });
            })
        });
    });
}
