import * as db from "../util/db";
import * as utils from "../util/utils";

/**
 * Returns the list of all booking for the given person and day
 * @param user the current user (jwt)
 * @param day a date specifying a day of the year
 * @return list of bookings
 */
export function getBookings(user: any, day: number): Promise<any> {
    return new Promise((resolve,reject) => {
        db.perform(connection => {
            connection.query("select * from booking where person=? and day=?", [user.name, utils.removeTimeFromDate(new Date(day))], (err,res) => {
                utils.asyncLoop(res, (i,next) => {
                    connection.query("select * from booking_template where id=?", [i.booking_template_id], (err,res) => {
                        i.booking_template = res[0];
                        next();
                    })
                }, () => { // completed loop
                    connection.release();
                    resolve(res);
                });
            });
        })
    });
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
    return new Promise((resolve,reject) => {
        let timePeriod = utils.timePeriodForMonth(year, month);
        let chartStmt = null;
        switch (chartType) {
            case 0: chartStmt = "SELECT t.type AS label,SUM(b.minutes) AS minutes FROM booking b,booking_template t WHERE b.booking_template_id=t.id AND b.person=? AND b.day>=? AND b.day<? GROUP BY t.type ORDER BY t.type DESC"; break;
            case 1: chartStmt = "SELECT p.name AS label,SUM(b.minutes) AS minutes FROM booking b,booking_template t,budget bu,project p WHERE b.booking_template_id=t.id AND t.budget_id=bu.id AND bu.project_id=p.id AND b.person=? AND b.day>=? AND b.day<? GROUP BY p.name ORDER BY p.name"; break;
            case 2: chartStmt = "SELECT SUM(b.minutes),COUNT(DISTINCT day) FROM Booking b WHERE b.person=:person AND b.day>=:from AND b.day<:to"; break;
        }
        db.perform(connection => {
            connection.query(chartStmt, [user.name, timePeriod.from, timePeriod.to], (err,res) => {
                connection.release();
                resolve(res);
            });
        });
    });
}

/**
 * Inserts or updates the given booking in the database.
 * @param user the current user (jwt)
 * @param booking a booking
 */
export function saveBooking(user: any, booking: any) {
    return new Promise((resolve,reject) => {
        //assertNoOverrun(booking);
        booking.person = user.name;
        booking.modified_date = new Date();
        booking.day = new Date(booking.day);
        delete booking.booking_template;
        if (booking.id) {
            if (booking.export_state == 1) booking.export_state == 2;
            db.perform(connection => {
                connection.query("UPDATE booking SET ? WHERE id=?",[booking, booking.id], err => {
                    connection.release();
                    resolve();
                });
            });
        } else {
            db.perform(connection => {
                connection.query("INSERT INTO booking SET ?", [booking], err => {
                    connection.release();
                    resolve();
                })
            });
        }
    });
}

/**
 * Removes the booking with the given ID
 * @param user the current user (jwt)
 * @param bookingId a booking ID
 */
export function deleteBooking(user: any, bookingId: number) {
    return new Promise((resolve,reject) => {
        db.perform(connection => {
            connection.query("DELETE FROM booking WHERE id=? AND person=?",[bookingId, user.name], err => {
                connection.release();
                resolve();
            })
        });
    });
}
