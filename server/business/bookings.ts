import * as db from "../util/db";
import * as utils from "../util/utils";
import * as Budgets from "./budgets";
import * as Templates from "./templates";

/**
 * Returns the list of all booking for the given person and day
 * @param user the current user (jwt)
 * @param day a date specifying a day of the year
 * @return list of bookings
 */
export function getBookings(user: any, day: number): Promise<any> {
    return db.connection().then(connection => 
        db.query(connection, "select * from booking where person=? and day=?", [user.name, utils.removeTimeFromDate(new Date(day))]).then(res =>
            utils.asyncLoopP(res, (i,next) => {
                db.query(connection, "select * from booking_template where id=?", [i.booking_template_id]).then(res => {
                    i.booking_template = res[0];
                    next();
                });
            }).then(() => { // completed loop
                connection.release();
                return res;
            })
        )
    );
}

export function getBooking(id: number): Promise<any> {
    return db.querySingle("SELECT * FROM booking WHERE id=?", [id]).then(res => res[0]);
}

/**
 * Returns the sum of booked minutes per BookingTemplate.type (NP,0W,1T)
 * for the given month
 * @param user the current user (jwt)
 * @param year the year, e.g. 2013
 * @param month a month constant as defined by Calendar.JANUARY to Calendar.DECEMBER
 * @param chartType chart type
 * @return Map of booked minutes per booking type
 */
export function getBookingSumsForMonth(user: any, year: number, month: number, chartType: number): Promise<any> {
    let timePeriod = utils.timePeriodForMonth(year, month);
    let chartStmt = null;
    switch (chartType) {
        case 0: chartStmt = "SELECT t.type AS label,SUM(b.minutes) AS minutes FROM booking b,booking_template t WHERE b.booking_template_id=t.id AND b.person=? AND b.day>=? AND b.day<? GROUP BY t.type ORDER BY t.type DESC"; break;
        case 1: chartStmt = "SELECT p.name AS label,SUM(b.minutes) AS minutes FROM booking b,booking_template t,budget bu,project p WHERE b.booking_template_id=t.id AND t.budget_id=bu.id AND bu.project_id=p.id AND b.person=? AND b.day>=? AND b.day<? GROUP BY p.name ORDER BY p.name"; break;
        case 2: chartStmt = "SELECT SUM(b.minutes) AS minutes,COUNT(DISTINCT day) AS days FROM booking b WHERE b.person=? AND b.day>=? AND b.day<?"; break;
    }
    return db.querySingle(chartStmt, [user.name, timePeriod.from, timePeriod.to]);
}

/**
 * Inserts or updates the given booking in the database.
 * @param user the current user (jwt)
 * @param booking a booking
 */
export function saveBooking(user: any, booking: any): Promise<any> {
    return assertNoOverrun(booking).then(() => {
        booking.person = user.name;
        booking.modified_date = new Date();
        booking.day = new Date(booking.day);
        delete booking.booking_template;
        if (booking.id) {
            if (booking.export_state == 1) booking.export_state == 2;
            return db.querySingle("UPDATE booking SET ? WHERE id=?",[booking, booking.id]);
        } else {
            return db.querySingle("INSERT INTO booking SET ?", [booking]);
        }
    });
}

/**
 * Removes the booking with the given ID
 * @param user the current user (jwt)
 * @param bookingId a booking ID
 */
export function deleteBooking(user: any, bookingId: number): Promise<any> {
    return db.querySingle("DELETE FROM booking WHERE id=? AND person=?",[bookingId, user.name]);
}

/**
 * Returns the list of all bookings for the given person name and last day
 * @param person a person name
 * @param day - the last export day
 * @return list of bookings
 */
export function getBookingsByLastExportDay(user: any, day: number): Promise<any> {
    return db.querySingle("SELECT * FROM booking WHERE person=? AND day>=? ORDER BY day DESC, person", [user.name, utils.removeTimeFromDate(new Date(day))]);
}

function assertNoOverrun(booking: any): Promise<any> {
    // get associated budget:
    return Templates.getBookingTemplate(booking.booking_template_id)
        .then(t => Budgets.getBudget(t.budget_id))
        .then(budget => {
            if (budget.allow_overrun == 1) return; // overrun allowed, everything is fine
            
            // check whether budget is about to overrun:
            return Budgets.getBudgetInfo(budget.id).then(budgetInfo => 
                getBooking(booking.id ? booking.id : 0).then(bookingInDb => {
                    let usedMinutes: number = budgetInfo.booked_minutes_recursive;

                    // subtract old value in DB if editing:
                    if (bookingInDb) usedMinutes -= bookingInDb.minutes;
                    
                    // now check whether inserted or edited value will fit into the remaining budget:
                    if (usedMinutes + booking.minutes > Math.abs(budgetInfo.budget.minutes))
                        throw {message:"Sorry, the remaining budget is insufficient and budget overrun is not allowed. Please contact your project manager to resolve this issue."};
                })
            );
        });
}
