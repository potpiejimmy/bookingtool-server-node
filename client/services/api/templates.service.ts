import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class TemplatesService {

    private url: string = '/pt/api/templates/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {
    }    
    
    findBookingTemplates(searchString:string): Promise<any> {
        return this.http.get(this.url+"?search="+searchString); // XXX
    }
}