import { Router, Request, Response, NextFunction } from "express";
import * as Bookings from "../business/bookings";

const bookingsRouter: Router = Router();

/**
 * getBookings(day?)
 */
bookingsRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    Bookings.getBookings(request.user, request.query.day ? parseInt(request.query.day) : Date.now()).then(res => response.json(res));
});

/**
 * saveBooking(booking)
 */
bookingsRouter.post("/", function (request: any, response: Response, next: NextFunction) {
    Bookings.saveBooking(request.user, request.body).then(() => response.json('ok'));
});

/**
 * getBookingSumsForMonth({year:number,month:number,chartType:number})
 */
bookingsRouter.post("/sumsForMonth", function (request: any, response: Response, next: NextFunction) {
    Bookings.getBookingSumsForMonth(request.user, request.body.year, request.body.month, request.body.chartType).then(res => response.json(res));
});

export { bookingsRouter }
