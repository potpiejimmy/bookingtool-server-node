import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class ProjectsService {

    private url: string = '/pt2/api/projects/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {
    }    
    
    getManagedProjects(): Promise<any> {
        return this.http.get(this.url+"?managed=true");
    }
}