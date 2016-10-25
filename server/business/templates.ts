import * as db from "../util/db";
import * as Domains from "./domains";

/**
 * findBookingTemplates(String searchString)
 * 
 * Returns the list of templates matching the given search criteria
 * @param searchString a search string
     * @return list of matching templates
 */
export function findBookingTemplates(user: any, searchString: string): Promise<any> {
    return new Promise((resolve,reject) => {
        Domains.getDomains(user).then(domains => {
            let domainIds = []
            domains.forEach(i=>domainIds.push(i.id));
            db.perform(connection => {
                connection.query("SELECT bt.* FROM booking_template bt,budget b,project p WHERE bt.budget_id=b.id AND b.project_id=p.id AND p.domain_id IN (?) AND bt.search_string LIKE ? AND bt.active = ? AND p.status=0", [
                    domainIds, "%"+searchString.replace("*", "%").replace(" ", "%") +"%", 1
                ], (err, res) => {
                    connection.release();
                    resolve(res);
                })
            })
        });
    });
}
