import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class ExportsService {

    private url: string = '/pt2/api/exports/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {
    }    
    
    getExcelForName(weeksToExport: number): Promise<any> {
        return this.http.getRaw(this.url).then(res => {
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(res.blob());
            link.download="bookings.xlsx";
            link.click();
        });
    }
}