import { Component } from '@angular/core';

import { MenuItem }  from 'primeng/primeng';

@Component({
  selector: 'app',
  templateUrl: 'pt/client/app.html'
})
export class AppComponent {
  title = 'Angular 2 With Express and PrimeNG';

    private menuitems: MenuItem[];

    ngOnInit() {
        this.menuitems = [
            {label: 'Main', icon: 'fa-bar-chart', routerLink: ['/main']},
            {label: 'Export', icon: 'fa-calendar', routerLink: ['/export']}
        ];
    }
}