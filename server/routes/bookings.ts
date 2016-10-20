import { Router, Request, Response, NextFunction } from "express";
import * as db from "../util/db";
import * as utils from "../util/utils";

var asyncLoop = require('node-async-loop');

const bookingsRouter: Router = Router();

/**
 * getBookings({day:number})
 * 
 * Returns the list of all booking for the given person and day
 * @param person a person name
 * @param day a date specifying a day of the year
 * @return list of bookings
 */
bookingsRouter.post("/", function (request: any, response: Response, next: NextFunction) {
    db.perform(connection => {
        connection.query("select * from booking where person=? and day=?", [request.user.name, new Date(request.body.day)], (err,res) => {
            asyncLoop(res, (i,next) => {
                if (!i) {next(); return;} // stupid asyncLoop loops over empty array
                connection.query("select * from booking_template where id=?", [i.booking_template_id], (err,res) => {
                    i.booking_template = res[0];
                    next();
                })
            }, err => { // completed loop
                connection.release();
                response.json(res);
            });
        });
    })
});

/**
 * getBookingSumsForMonth({year:number,month:number,chartType:number})
 * 
 * Returns the sum of booked minutes per BookingTemplate.type (NP,0W,1T)
 * for the given month
 * @param year the year, e.g. 2013
 * @param month a month constant as defined by Calendar.JANUARY to Calendar.DECEMBER
 * @param chartType chart type
 * @return Map of booked minutes per booking type
 */
bookingsRouter.post("/sumsForMonth", function (request: any, response: Response, next: NextFunction) {
    let timePeriod = utils.timePeriodForMonth(request.body.year, request.body.month);
    let chartStmt = null;
    switch (request.body.chartType) {
        case 0: chartStmt = "SELECT t.type AS label,SUM(b.minutes) AS minutes FROM booking b,booking_template t WHERE b.booking_template_id=t.id AND b.person=? AND b.day>=? AND b.day<? GROUP BY t.type"; break;
        case 1: chartStmt = "SELECT p.name AS label,SUM(b.minutes) AS minutes FROM booking b,booking_template t,budget bu,project p WHERE b.booking_template_id=t.id AND t.budget_id=bu.id AND bu.project_id=p.id AND b.person=? AND b.day>=? AND b.day<? GROUP BY p.name"; break;
        case 2: chartStmt = "SELECT SUM(b.minutes),COUNT(DISTINCT day) FROM Booking b WHERE b.person=:person AND b.day>=:from AND b.day<:to"; break;
    }
    db.perform(connection => {
        connection.query(chartStmt, [request.user.name, timePeriod.from, timePeriod.to], (err,res) => {
            connection.release();
            response.json(res);
        });
    });
});

export { bookingsRouter }
