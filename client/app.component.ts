import { Component } from '@angular/core';
import { AuthGuard } from './services/authguard.service';

import { MenuItem }  from 'primeng/primeng';

import { LoginService } from './services/login.service';

@Component({
  selector: 'app',
  templateUrl: 'pt/client/app.html'
})
export class AppComponent {

    private menuitems: MenuItem[];

    constructor(public loginService: LoginService, private authGuard: AuthGuard) {}

    ngOnInit() {
        this.menuitems = [
            {label: 'Main', routerLink: ['/main']},
            {label: 'Export', routerLink: ['/export']},
            {label: 'Domains', routerLink: ['/domains']},
            {label: 'Projects', routerLink: ['/projects']},
            {label: 'Budgets', routerLink: ['/budgets']},
            {label: 'Booking Templates', routerLink: ['/templates']},
            {label: 'FI', routerLink: ['/adminfi']},
            {label: 'Budget Control', routerLink: ['/budgetcontrol']},
            {label: 'Budget Plans', routerLink: ['/budgetplans']},
            {label: 'Forecasts', routerLink: ['/forecasts']}
        ];
    }

    logout() {
        this.loginService.logout();
        this.authGuard.checkLogin("/main");
    }
}