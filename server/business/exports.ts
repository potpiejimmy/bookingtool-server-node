import * as Bookings from './bookings';
import * as Excel from '../util/excel';
import * as utils from "../util/utils";
import * as db from "../util/db";

export function getExcelForName(user: any, weeksToExport: number): Promise<any> {
    
    let lastExportDay = new Date();
    lastExportDay.setDate(lastExportDay.getDate() - weeksToExport*7);

    return Bookings.getBookingsByLastExportDay(user, lastExportDay.getTime()).then(bookingList => {
        return Excel.createWorkbookForBookings(bookingList, false).then(result => {
            return db.connection().then(connection => {
                return utils.asyncLoopP(bookingList, (booking, next) => {
                    db.query(connection, "update booking set export_state=1").then(()=>next());
                }).then(() => {
                    connection.release();
                    return result;
                }).catch(err => {
                    connection.release()
                });
            });
        });
    });
}
