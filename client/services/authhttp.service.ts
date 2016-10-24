import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

    handleResponse(request: Observable<Response>): Promise<any> {
        return request.toPromise()
               .then(res => res.json())
               .catch(err => this.handleError(err, this));
    }

    get(url): Promise<any>  {
        return this.handleResponse(this.http.get(url, this.requestOptions()));
    }

    post(url, data): Promise<any>  {
        return this.handleResponse(this.http.post(url, data, this.requestOptions()));
    }

    delete(url): Promise<any>  {
        return this.handleResponse(this.http.delete(url, this.requestOptions()));
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