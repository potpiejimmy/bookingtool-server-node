import { Component } from '@angular/core';

import { MenuItem }  from 'primeng/primeng';

@Component({
  selector: 'app',
  templateUrl: 'pt/client/app.html'
})
export class AppComponent {

    private menuitems: MenuItem[];

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
}