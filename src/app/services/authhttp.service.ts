import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import { AuthGuard } from './authguard.service';
import { AppService } from './app.service';

@Injectable()
export class AuthHttp {
    constructor (
        private http: Http,
        private app: AppService,
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
        this.app.clearMessages();
        return request.toPromise()
               .catch(err => this.handleError(err, this));
    }

    handleResponseJson(request: Observable<Response>): Promise<any> {
        return this.handleResponse(request).then(res => res.json());
    }

    handleResponseBlob(request: Observable<Response>): Promise<any> {
        return this.handleResponse(request).then(res => res.blob());
    }

    getBlob(url): Promise<any>  {
        let options = this.requestOptions();
        options["responseType"] = ResponseContentType.Blob;
        return this.handleResponseBlob(this.http.get(url, options));
    }

    get(url): Promise<any>  {
        return this.handleResponseJson(this.http.get(url, this.requestOptions()));
    }

    post(url, data): Promise<any>  {
        return this.handleResponseJson(this.http.post(url, data, this.requestOptions()));
    }

    put(url, data): Promise<any>  {
        return this.handleResponseJson(this.http.put(url, data, this.requestOptions()));
    }

    delete(url): Promise<any>  {
        return this.handleResponseJson(this.http.delete(url, this.requestOptions()));
    }

    relogin() {
        console.info("loginService", this.loginService);
        this.loginService.logout();
        this.authGuard.checkLogin('/'); // go to main page via login
    }

    private handleError(error: any, me: any): Promise<any> {
        console.error('An error occurred', JSON.stringify(error.json())); // XXX for debugging purposes
        me.app.setMessage("Error", error.json().message || error.message || error);
        if (error.status == 401) me.relogin(); // not authorized, go to login
        return Promise.reject(error.message || error);
    }
}