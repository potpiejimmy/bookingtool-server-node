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

                if (withNameColumn)
                    sheet.addRow([sapBooking.day,sapBooking.person,sapBooking.psp,sapBooking.pspLabel,sapBooking.type,sapBooking.typeLabel,sapBooking.description,sapBooking.salesRepresentative,sapBooking.subproject,sapBooking.hundredthHours/100]);
                else
                    sheet.addRow([sapBooking.day,sapBooking.psp,sapBooking.pspLabel,sapBooking.type,sapBooking.typeLabel,sapBooking.description,sapBooking.salesRepresentative,sapBooking.subproject,sapBooking.hundredthHours/100]);
                    
                lastDate = booking.day;
            });
            next();
        });
    }).then(() => workbook);

    //autosize every column!
    // XXX TODO
}

function createHeaderSheetForBookings(sheet: any, withNameColumn: boolean) {
    if (withNameColumn)
        sheet.addRow(["Datum","Person","PSP-Element","Bezeichnung","Tätigkeitsart","Bezeichnung","Tätigkeit","VB-Beauftragter","Teilprojekt","Stunden"]);
    else
        sheet.addRow(["Datum","PSP-Element","Bezeichnung","Tätigkeitsart","Bezeichnung","Tätigkeit","VB-Beauftragter","Teilprojekt","Stunden"]);
}
