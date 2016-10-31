import * as db from "../util/db";
import * as utils from "../util/utils";
import * as Templates from "./templates";

/**
 * Returns the budget info value object for the given budget ID
 * @param budgetId a budget ID
 * @param period  a time period for the sum of booking minutes returned in the info value object
 * @return the budget info value object
 */
export function getBudgetInfo(budgetId: number, period: any = null): Promise<any> {
    return getBudget(budgetId)
        .then(budget => toInfoVo(budget, period))
        .then(budget => calculateBudget(budget, period))
        .then(budget => getFullBudgetName(budget.budget.id).then(n => {
            budget.full_name = n;
            return budget;
        }));
}

/**
 * Returns the budget with the given ID
 * @param budgetId a budget ID
 * @return the budget
 */
export function getBudget(budgetId: number): Promise<any> {
    return db.querySingle("SELECT * FROM budget WHERE id=?", [budgetId]).then(res => res[0]);
}

/**
 * Returns the full path name for the given budget ID
 * @param budgetId a budget ID
 * @return full budget path name
 */
export function getFullBudgetName(budgetId: number): Promise<any> {
    return getBudget(budgetId).then(b => {
        let condition = { parent_id: b.parent_id };
        let stb: string = b.name;
        return utils.asyncWhileP(() => condition.parent_id, next => {
            getBudget(condition.parent_id).then(b => {
                stb = b.name + " \u25B6 " + stb;
                condition.parent_id = b.parent_id;
                next();
            });
        }).then(() => stb);
    });
}

function toInfoVo(budget: any, period: any = null): Promise<any> {
    if (!budget) return Promise.reject("budget is null");
    return getBookedMinutes(budget.id, period).then(minutes => 
        Templates.getBookingTemplatesByBudgetId(budget.id).then(templates => {
            return {
                budget: budget,
                booked_minutes: minutes,
                booked_minutes_recursive: 0,
                number_of_templates: templates.length
            };
        })
    );
}

export function getBookedMinutes(budgetId: number, period: any = null): Promise<any> {
    let stmt: string = "SELECT SUM(b.minutes) AS sum FROM booking b, booking_template t WHERE b.booking_template_id=t.id AND t.budget_id=?";
    if (period) stmt += " AND b.day>=:from AND b.day<:to";
    let stmtParams: any[] = [budgetId];
    if (period) stmtParams.push(period.from, period.to);
    return db.querySingle(stmt, stmtParams).then(res => res[0].sum ? res[0].sum : 0);
}

function calculateBudget(budget: any, period: any): Promise<any> {
    return getBudgetsForParent(budget.budget.id).then(childBudgets => {
        if (childBudgets.length == 0) {
            // leaf budget
            //change prefix if budget was a root in its previous life
            if (budget.budget.minutes < 0)
                budget.budget.minutes = -budget.budget.minutes;
            budget.booked_minutes_recursive = budget.booked_minutes;
            return budget;
        }
        
        let sum: number = 0;
        let sumBookedRecursive: number = budget.booked_minutes;
        return utils.asyncLoopP(childBudgets, (b, next) => {
            toInfoVo(b, period).then(binfo => calculateBudget(binfo, period)).then(child => {
                sum += Math.abs(child.budget.minutes);
                sumBookedRecursive += child.booked_minutes_recursive;
                next();
            });
        }).then(() => {
            budget.budget.minutes = -sum; // negative means 'calculated'
            budget.booked_minutes_recursive = sumBookedRecursive;
            return budget;
        });
    });
}

/**
 * Returns the list of budgets found for the given parent budget ID.
 * 
 * @param parentId a budget ID
 * @return list of budgets
 */
export function getBudgetsForParent(parentId: number): Promise<any> {
    return db.querySingle("SELECT * FROM budget b WHERE b.parent_id = ? ORDER BY b.name", [parentId]);
}
