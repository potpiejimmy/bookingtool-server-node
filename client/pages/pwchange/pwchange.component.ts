import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AppService } from '../../services/app.service';
import { UsersService }  from '../../services/api/users.service';

@Component({
  selector: 'pwchange',
  templateUrl: 'pt/client/pages/pwchange/pwchange.html'
})
export class PasswordChangeComponent {
    
    @ViewChild('oldPasswordInputField') oldPasswordInputField;

    oldPassword: string;
    newPassword1: string;
    newPassword2: string;

    changePasswordNeeded: boolean = false;

    constructor(
        private app: AppService,
        private loginService: LoginService,
        private router: Router,
        private usersService: UsersService) {
    }

    ngAfterViewInit() {
        this.oldPasswordInputField.nativeElement.focus();
    }

    save() {
        this.usersService.changePassword(this.oldPassword, this.newPassword1).then(() => {
            this.router.navigate(['/main']);
        });
    }

}
