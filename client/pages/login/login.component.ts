import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Message }  from 'primeng/primeng';

@Component({
    selector: 'login',
    templateUrl: 'pt/client/pages/login/login.html'
})
export class LoginComponent implements AfterViewInit {

    @ViewChild('nameInputField') nameInputField;

    messages: Message[];
    user: string;
    password: string;

    constructor(private loginService: LoginService, private router: Router) {
    }

    ngAfterViewInit() {
        this.nameInputField.nativeElement.focus();
    }

    setMessage() {
        this.messages = [];
        this.messages.push({severity:'error', summary:'Login failed', detail:'Unknown user or wrong password.'});
    }

    login() {
        this.loginService.login(this.user, this.password).then(result => {
            if (result) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                let redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/pt';
                // Redirect the user
                this.router.navigate([redirect]);
            } else {
                this.setMessage();
            }
        });
    }
}