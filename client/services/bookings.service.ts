import { Injectable }    from '@angular/core';
import { AuthHttp } from './authhttp.service';
import { LoginService } from './login.service';

@Injectable()
export class BookingsService {

    private url: string = '/pt/api/bookings';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {

    }    
    
    getBookings(day:number): Promise<any> {
        return this.http.post(this.url, {day:day})
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}