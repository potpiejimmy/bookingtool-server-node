import * as moment from 'moment';
import * as utils from '../util/utils';

/**
 * Represents an exportable formatted booking for SAP.
 * This class holds hundredths parts of an hour instead of minutes for SAP export.
 */
export class SAPBooking {
    
    // Datum
    day: string;
    // Person
    person: string;
    // PSP
    psp: string;
    // PSP-Name
    pspLabel: string;
    // Taetigkeitsart
    type: string;
    // Bezeichnung Taetigkeitsart
    typeLabel: string;
    // Taetigkeit
    description: string;
    // VB-Beauftragter
    salesRepresentative: string;
    // Teilprojekt
    subproject: string;
    // Hundertstel Stunden
    hundredthHours: number;
    
    /**
     * Creates a new SAP booking for the given booking and template
     * 
     * @param booking a booking
     * @param bt connected booking template
     */
    constructor(booking: any, bt: any) {
        this.day = moment(booking.day).format("dd., DD.MM.YYYY");
        this.person = booking.person;
        this.psp = bt.psp;
        this.pspLabel = bt.name;
        this.type = bt.type;
        this.typeLabel = utils.labelForBookingType(bt.type);
        this.description = booking.description;
        this.salesRepresentative = booking.sales_representative;
        this.subproject = bt.subproject;
        this.hundredthHours = SAPBooking.roundedHundredthHoursForMinutes(booking.minutes);
    }
    
    public static roundedHundredthHoursForMinutes(minutes: number): number {
        return Math.round(minutes/60*100);
    }
    
    public static createSAPBookingsForBooking(booking: any, bt: any): SAPBooking[] {
        // split the PSP elements and create separate bookings
        let psps: string[] = bt.psp.split(",");
        let result: SAPBooking[] = [];
        
        if (psps.length === 1) {
            // speed optimization:
            result[0] = new SAPBooking(booking, bt);
            return result;
        }
        
        let gravities: number[] = [];
        let sumGravity: number = 0;
        for (let i=0; i<psps.length; i++) {
            psps[i] = psps[i].trim();
            let gravityPos: number = psps[i].indexOf("[");
            if (gravityPos >= 0) {
                try {gravities[i] = parseInt(psps[i].substring(gravityPos+1, psps[i].length-1).trim());}
                catch (e) {gravities[i] = 1;}
                psps[i] = psps[i].substring(0, gravityPos);
            } else {
                gravities[i] = 1;
            }
            sumGravity += gravities[i];
        }
        
        let timeSum: number = SAPBooking.roundedHundredthHoursForMinutes(booking.minutes);
        let timeIter: number = 0;
        
        for (let i=0; i<psps.length; i++) {
            let sapBooking: SAPBooking = new SAPBooking(booking, bt);
            if (i === psps.length-1) {
                // if this is the last split booking, use the unrounded rest of
                // the time so the sum is always equal to the original booked time
                sapBooking.hundredthHours = (timeSum - timeIter);
            } else {
                sapBooking.hundredthHours = SAPBooking.roundedHundredthHoursForMinutes(booking.minutes*gravities[i]/sumGravity);
                timeIter += sapBooking.hundredthHours;
            }
            sapBooking.psp = psps[i];
            result[i] = sapBooking;
        }
        return result;
    }
}
