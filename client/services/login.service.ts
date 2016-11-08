import { Injectable }    from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JwtHelper } from 'angular2-jwt';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class LoginService {
  
  isLoggedIn: boolean = false;
  loginToken: any;
  loginTokenEncoded: any;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private loginServiceUrl = '/pt2/api/login';  // URL to web api

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http, private localStorageService: LocalStorageService) {
    this.readToken();
  }

  readToken() {
    this.loginTokenEncoded = this.localStorageService.get('token');
    if (!this.loginTokenEncoded) return false;
    this.loginToken = this.jwtHelper.decodeToken(this.loginTokenEncoded);
    return this.isLoggedIn = this.loginToken != null;
  }

  login(user, password): Promise<boolean> {
    return this.http.post(this.loginServiceUrl, {"user":user, "password":password})
        .toPromise()
        .then(result => {
          let resJson = result.json();
          let token = resJson.token;
          if (!token) return false;
          this.localStorageService.set('token', token);
          return this.readToken();
        });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.localStorageService.remove('token');
  }

  isUserInRole(role:string):boolean {
    if (!this.loginToken) return false;
    return this.loginToken.roles.indexOf(role)>=0;
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}