import * as Excel from 'exceljs';
import * as BookingTemplates from '../business/templates';
import * as utils from "../util/utils";
import { SAPBooking } from '../vo/sapbooking';

export function createWorkbookForBookings(bookingList: any, withNameColumn: boolean) : Promise<any> {
    let workbook = new Excel.Workbook();
    let sheet = workbook.addWorksheet('Bookings');

    createHeaderSheetForBookings(sheet, withNameColumn);

    let lastDate: Date = null;

    return utils.asyncLoopP(bookingList, (booking,next) => {
        BookingTemplates.getBookingTemplate(booking.booking_template_id).then(bt => {
            SAPBooking.createSAPBookingsForBooking(booking, bt).forEach(sapBooking => {

                if (booking.export_state === 2) {
//                    style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
//                    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                }

                if (!withNameColumn && lastDate != null && lastDate.getTime() != booking.day.getTime())
                    sheet.addRow([]); // add empty row for each new day if person-based export

                let row = [sapBooking.day,sapBooking.person,sapBooking.psp,sapBooking.pspLabel,sapBooking.type,sapBooking.typeLabel,sapBooking.description,sapBooking.salesRepresentative,sapBooking.subproject,sapBooking.hundredthHours/100];
                if (!withNameColumn) row = row.splice(1,1); // remove sapBooking.person
                sheet.addRow(row);
                    
                lastDate = booking.day;
            });
            next();
        });
    }).then(() => workbook);

    //autosize every column!
    // XXX TODO
}

function createHeaderSheetForBookings(sheet: any, withNameColumn: boolean) {
    let cols = [{width:20},{width:15},{width:50},{width:70},{width:5},{width:15},{width:150},{width:20},{width:20},{width:10}];
    let row = ["Datum","Person","PSP-Element","Bezeichnung","Tätigkeitsart","Bezeichnung","Tätigkeit","VB-Beauftragter","Teilprojekt","Stunden"];
    if (!withNameColumn) {
        cols = cols.splice(1,1);
        row = row.splice(1,1); // remove "Person"
    }
    sheet.columns = cols;
    sheet.addRow(row);
}
