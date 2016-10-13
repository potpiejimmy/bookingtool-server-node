import { Injectable }    from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JwtHelper } from 'angular2-jwt';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class LoginService {
  
  isLoggedIn: boolean = false;
  loginToken: any;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private loginServiceUrl = '/pt/api/login';  // URL to web api

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http, private localStorageService: LocalStorageService) {
    this.loginToken = localStorageService.get('token');
    this.isLoggedIn = this.loginToken != null;
  }

  getHeroes(): Promise<any> {
    return this.http.get(this.loginServiceUrl)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  login(user, password): Promise<boolean> {
    return this.http.post(this.loginServiceUrl, {"user":user, "password":password})
        .toPromise()
        .then(result => {
          let resJson = result.json();
          console.info(JSON.stringify(resJson));
          let token = resJson.token;
          this.loginToken = this.jwtHelper.decodeToken(token);  
          this.localStorageService.set('token', this.loginToken);        
          return this.isLoggedIn = this.loginToken != null;
        });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.localStorageService.remove('token');
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}