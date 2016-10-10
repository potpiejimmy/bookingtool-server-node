import { Component } from '@angular/core';
import { AuthGuard } from './services/authguard.service';

import { MenuItem }  from 'primeng/primeng';

import { LoginService } from './services/login.service';
import { TypeWriter } from './util/typewriter';

@Component({
  selector: 'app',
  templateUrl: 'pt/client/app.html'
})
export class AppComponent {

    private menuitems: MenuItem[];
    private typeWriterMessage: string = '\u007C';

    constructor(public loginService: LoginService, private authGuard: AuthGuard) {}

    ngOnInit() {
        this.menuitems = [
            {label: 'Main', routerLink: ['/main'], icon: 'ui-icon-input'},
            {label: 'Export', routerLink: ['/export'], icon: 'ui-icon-import-export'},
            {label: 'Domains', routerLink: ['/domains']},
            {label: 'Projects', routerLink: ['/projects']},
            {label: 'Budgets', routerLink: ['/budgets']},
            {label: 'Booking Templates', routerLink: ['/templates']},
            {label: 'FI', routerLink: ['/adminfi']},
            {label: 'Budget Control', routerLink: ['/budgetcontrol']},
            {label: 'Budget Plans', routerLink: ['/budgetplans']},
            {label: 'Forecasts', routerLink: ['/forecasts']}
        ];

        this.startTypeWriter();
    }

    startTypeWriter() {
        let tw = new TypeWriter([
            'Welcome to the BCON Budget Planning Tool.',
            'Built with the power of Angular 2.',
            'Next generation web technology at work.'
        ]);
        tw.start().subscribe(msg => {
            this.typeWriterMessage = msg;
            if (this.loginService.isLoggedIn) tw.stopAt(0);
        });
    }

    logout() {
        this.loginService.logout();
        this.authGuard.checkLogin("/main");
    }
}