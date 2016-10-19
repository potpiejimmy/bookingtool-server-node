import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoginService } from './login.service';

@Injectable()
export class AuthHttp {
    constructor (private http: Http, private loginService: LoginService) {
    }

    requestOptions() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.loginService.loginTokenEncoded);
        return { headers: headers };
    }

    get(url) {
        return this.http.get(url, this.requestOptions())
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }

    post(url, data) {
        return this.http.post(url, data, this.requestOptions())
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}