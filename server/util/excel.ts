import * as Excel from 'exceljs';

export function createWorkbookForBookings(bookingList: any, withNameColumn: boolean) : any {
    let workbook = new Excel.Workbook();
    let sheet = workbook.addWorksheet('Bookings');

    sheet.addRow([3, 'Sam', new Date()]);
    return workbook;
}
