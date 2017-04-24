import * as Projects from './projects';
import * as Bookings from './bookings';
import * as Excel from '../util/excel';
import * as utils from "../util/utils";
import * as db from "../util/db";

export function getExcelForName(user: any, weeksToExport: number): Promise<any> {
    
    let lastExportDay = new Date();
    lastExportDay.setDate(lastExportDay.getDate() - weeksToExport*7);

    return Bookings.getBookingsByLastExportDay(user, lastExportDay).then(bookingList => {
        return Excel.createWorkbookForBookings(bookingList, false).then(result => {
            return db.connection().then(connection => {
                return utils.asyncLoopP(bookingList, (booking, next) => {
                    db.query(connection, "update booking set export_state=1 where id=?", [booking.id])
                    .then(()=>next()).catch(err=>next());
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

function startDayForMonthsToExport(monthsToExport: number): Date {
    let startDay = new Date();
    startDay.setMonth(startDay.getMonth() - monthsToExport);
    startDay.setDate(1);
    return utils.removeTimeFromDate(startDay);
}

export function getExcelForProject(user: any, projectToExport: number, monthsToExport: number): Promise<any> {
    return Projects.isManagedProjectOf(user, projectToExport).then(isManagedProject => {
        if (!isManagedProject) throw "Sorry, this operation is only available to project administrators.";
        return Bookings.getBookingsForProject(user, projectToExport, startDayForMonthsToExport(monthsToExport)).then(bookingList => {
            return Excel.createWorkbookForBookings(bookingList, true);
        });
    });
}
