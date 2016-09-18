import { Component } from '@angular/core';
import 'rxjs/Rx';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'maininput',
  templateUrl: 'pt/client/pages/maininput/maininput.html'
})
export class MainInputComponent {
    label = 'Loading data...';
    data = null;
    users = [];

    constructor(private loginService : LoginService) { }

    ngOnInit() {
        this.loadDetails();
    }

    loadDetails() {
        this.loginService.getHeroes().then(
            res => {
                this.data = JSON.stringify(res);
                this.users = res;
                this.label = 'Received:';
            });
    }
}
