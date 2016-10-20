import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { LoginService } from './login.service';
import { AuthGuard } from './authguard.service';

@Injectable()
export class AuthHttp {
    constructor (
        private http: Http,
        private loginService: LoginService,
        private authGuard : AuthGuard) {
    }

    requestOptions() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.loginService.loginTokenEncoded);
        return { headers: headers };
    }

    get(url) {
        return this.http.get(url, this.requestOptions())
                .toPromise()
                .then(res => res.json())
                .catch(err => this.handleError(err, this));
    }

    post(url, data) {
        return this.http.post(url, data, this.requestOptions())
                .toPromise()
                .then(res => res.json())
                .catch(err => this.handleError(err, this));
    }

    relogin() {
        console.info("loginService", this.loginService);
        this.loginService.logout();
        this.authGuard.checkLogin('/'); // go to main page via login
    }

    private handleError(error: any, me: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        if (error.status == 401) {
            console.info("HTTP STATUS", error.status);
            me.relogin();
        }
        return Promise.reject(error.message || error);
    }
}