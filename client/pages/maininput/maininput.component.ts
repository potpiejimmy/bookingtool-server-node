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

    current = {"day": Date.now()};

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

    edit(row) {
        console.info(JSON.stringify(row));
    }

    dateChanged(newValue) {
        console.info("Date changed to: "+newValue);
    }

    formatDate():string {
        let d = new Date(this.current.day);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return ("0"+d.getDate()).substr(-2) + " " + months[d.getMonth()] + " " + d.getFullYear(); 
    }

    get currentDay():string {
        return this.formatDate() + "                        :" + this.current.day;
    }

    set currentDay(d:string) {
        this.current.day = parseInt(d.substr(d.indexOf(":")+1));
        console.info("set date " + this.current.day);
    }
}
