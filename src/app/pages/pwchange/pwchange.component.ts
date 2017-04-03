import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { UsersService }  from '../../services/api/users.service';

@Component({
  selector: 'pwchange',
  templateUrl: 'pwchange.html'
})
export class PasswordChangeComponent {
    
    @ViewChild('oldPasswordInputField') oldPasswordInputField;

    oldPassword: string;
    newPassword1: string;
    newPassword2: string;

    changePasswordNeeded: boolean = false;

    constructor(
        public app: AppService,
        public router: Router,
        public usersService: UsersService) {
    }

    ngAfterViewInit() {
        this.oldPasswordInputField.nativeElement.focus();
    }

    save() {
        if (this.newPassword1 != this.newPassword2) {
            this.app.setMessage("", "The new password and the password confirmation do not match.");
            return;
        }
        this.usersService.changePassword(this.oldPassword, this.newPassword1).then(() => {
            this.router.navigate(['/main']);
        });
    }

}
