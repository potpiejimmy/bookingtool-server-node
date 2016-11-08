import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class UsersService {

    private url: string = '/pt/api/users/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {
    }    
    
    changePassword(oldPassword: string, newPassword: string): Promise<any> {
        return this.http.put(this.url, {oldPassword: oldPassword, newPassword: newPassword});
    }
}