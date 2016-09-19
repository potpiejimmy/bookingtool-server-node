import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
    selector: 'login',
    templateUrl: 'pt/client/pages/login/login.html'
})
export class LoginComponent {
    message: string;

    constructor(private loginService: LoginService, private router: Router) {
        this.setMessage();
    }

    setMessage() {
        this.message = 'Your are logged ' + (this.loginService.isLoggedIn ? 'in' : 'out');
    }

    login() {
        this.message = 'Trying to log in ...';
        this.loginService.login().then(() => {
            this.setMessage();

            if (this.loginService.isLoggedIn) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                let redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/pt';
                // Redirect the user
                this.router.navigate([redirect]);
            }
        });
    }
}