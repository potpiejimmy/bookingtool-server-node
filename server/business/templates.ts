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
    return Domains.getDomains(user).then(domains => {
        let domainIds = []
        domains.forEach(i=>domainIds.push(i.id));
        return db.querySingle("SELECT bt.* FROM booking_template bt,budget b,project p WHERE bt.budget_id=b.id AND b.project_id=p.id AND p.domain_id IN (?) AND bt.search_string LIKE ? AND bt.active = ? AND p.status=0", [
            domainIds, "%"+searchString.replace("*", "%").replace(" ", "%") +"%", 1
        ]);
    });
}

/**
 * Returns the booking templates associated with the given budget ID
 * @param budgetId a budget ID
 * @return a list of booking templates
 */
export function getBookingTemplatesByBudgetId(budgetId: number): Promise<any> {
    return db.querySingle("SELECT * FROM booking_template bt WHERE bt.budget_id = ? ORDER BY bt.sales_representative,bt.psp", [budgetId]);
}

/**
 * Returns the template for the given ID.
 * @export
 * @param {number} bookingTemplateId
 * @returns {Promise<any>}
 */
export function getBookingTemplate(bookingTemplateId: number): Promise<any> {
    return db.querySingle("SELECT * FROM booking_template WHERE id=?", [bookingTemplateId]).then(res => res[0]);
}

/**
 * Returns the list of last used booking templates for the given person.
 * @param user user jwt token
 * @param num number of templates to return
 * @return list of last used templates
 */
export function getLastUsedByPerson(user: any, num: number = 10): Promise<any> {
    return db.querySingle("SELECT bt.* FROM booking_template bt,booking b WHERE b.booking_template_id = bt.id AND b.person = ? GROUP BY bt.id ORDER BY MAX(b.modified_date) DESC, bt.id LIMIT ?", [user.name, num]);
}
