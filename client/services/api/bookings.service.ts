import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class BookingsService {

    private url: string = '/pt/api/bookings/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {

    }    
    
    getBookings(day:number): Promise<any> {
        return this.http.post(this.url, {day:day});
    }

    getBookingSumsForMonth(year:number, month:number, chartType:number) {
        return this.http.post(this.url+"sumsForMonth", {year:year,month:month,chartType:chartType});
            
    }
}