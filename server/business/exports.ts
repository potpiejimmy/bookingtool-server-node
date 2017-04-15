import * as Bookings from './bookings';
import * as Excel from '../util/excel';

export function getExcelForName(user: any, weeksToExport: number): Promise<any> {
    
    let lastExportDay = new Date();
    lastExportDay.setDate(lastExportDay.getDate() - weeksToExport*7);

    return Bookings.getBookingsByLastExportDay(user, lastExportDay.getTime()).then(bookingList => {
        let result = Excel.createWorkbookForBookings(bookingList, false);
        
        //     for (Booking booking : bookingList)
        //         booking.setExportState((byte)1);  

        return result;
    });
}
