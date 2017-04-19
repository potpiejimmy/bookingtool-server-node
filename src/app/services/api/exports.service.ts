import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';
import { AppService } from "../app.service";

@Injectable()
export class ExportsService {

    private url: string = '/pt2/api/exports/';  // URL to web api

    constructor(public app: AppService,
                private http: AuthHttp,
                private loginService : LoginService) {
    }    
    
    getExcelForName(weeksToExport: number): Promise<any> {
        return this.http.getBlob(this.url+"?weeks="+weeksToExport).then(blob => {
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(blob);
            link.download="bookings_"+this.app.loginService.loginToken.name+".xlsx";
            link.click();
        });
    }
}