import { Component } from '@angular/core';
import 'rxjs/Rx';
import { HTTP_PROVIDERS } from '@angular/http';
import { PrincipalService } from './principal.service';

@Component({
  selector: 'app',
  templateUrl: 'app/app.html',
  providers: [ HTTP_PROVIDERS, PrincipalService ]
})
export class AppComponent {
    label = 'Loading data...';
    data = null;
    users = [];

    constructor(private principalService : PrincipalService) { }

    ngOnInit() {
        this.loadDetails();
    }

    loadDetails() {
        this.principalService.getUsers(
            res => {
                this.data = res;
                this.users = JSON.parse(res);
                this.label = 'Received:';
            });
    }
}
