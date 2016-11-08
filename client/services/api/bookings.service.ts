import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class BookingsService {

    private url: string = '/pt2/api/bookings/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {

    }    
    
    getBookings(day:number): Promise<any> {
        return this.http.get(this.url+"?day="+day);
    }

    saveBooking(booking: any): Promise<any> {
        return this.http.post(this.url, booking);
    }

    getBookingSumsForMonth(year:number, month:number, chartType:number): Promise<any> {
        return this.http.post(this.url+"sumsForMonth", {year:year,month:month,chartType:chartType});
    }

    deleteBooking(bookingId: any): Promise<any> {
        return this.http.delete(this.url+bookingId);
    }
}