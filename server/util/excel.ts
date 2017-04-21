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

                if (!withNameColumn && lastDate != null && lastDate.getTime() != booking.day.getTime())
                    sheet.addRow([]); // add empty row for each new day if person-based export

                let row = [sapBooking.day,sapBooking.person,sapBooking.psp,sapBooking.pspLabel,sapBooking.type,sapBooking.typeLabel,sapBooking.description,sapBooking.salesRepresentative,sapBooking.subproject,sapBooking.hundredthHours/100];
                if (!withNameColumn) row.splice(1,1); // remove sapBooking.person
                sheet.addRow(row);

                if (booking.export_state === 2) {
                    let cells = sheet.lastRow;
                    for (let i=0; i<cells.values.length-1; i++) cells.getCell(i+1).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'FFFFFF66'}
                    };
                }

                lastDate = booking.day;
            });
            next();
        });
    }).then(() => workbook);

    //autosize every column!
    // XXX TODO
}

function createHeaderSheetForBookings(sheet: any, withNameColumn: boolean) {
    let cols = [{width:16},{width:15},{width:20},{width:30},{width:5},{width:10},{width:50},{width:12},{width:12},{width:8}];
    let row = ["Datum","Person","PSP-Element","Bezeichnung","Tätigkeitsart","Bezeichnung","Tätigkeit","VB-Beauftragter","Teilprojekt","Stunden"];
    if (!withNameColumn) {
        cols.splice(1,1);
        row.splice(1,1); // remove "Person"
    }
    sheet.columns = cols;
    sheet.addRow(row);
}
