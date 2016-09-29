import { Injectable }    from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
  
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private loginServiceUrl = '/pt/api/login';  // URL to web api
  
  constructor(private http: Http) { }

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
          var token = result.json();
          console.info(JSON.stringify(token));
          return this.isLoggedIn = token.pwStatus != null;
        });
  }

  logout(): void {
    this.isLoggedIn = false;
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}