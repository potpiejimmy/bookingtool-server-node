import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { AuthGuard } from './services/authguard.service';

import { MenuItem }  from 'primeng/primeng';

import { AppService } from './services/app.service';
import { TypeWriter } from './util/typewriter';

//declare var Ultima: any;

@Component({
  selector: 'app',
  templateUrl: 'app.html'
})
export class AppComponent implements AfterViewInit {

    public typeWriterMessage: string = '\u007C';

    constructor(private el: ElementRef, public app: AppService, private authGuard: AuthGuard) {}

    ngOnInit() {
        this.startTypeWriter();
    }

    ngAfterViewInit() {
//        Ultima.init(this.el.nativeElement);
    }

    startTypeWriter() {
        let tw = new TypeWriter([
            'Welcome to the BCON Budget Planning Tool',
            'Built with the power of Angular 2 and PrimeNG',
            'Next generation web technology at work'
        ]);
        tw.start().subscribe(msg => {
            this.typeWriterMessage = msg;
            if (this.app.loginService.isLoggedIn) tw.stopAt(0);
        });
    }

    logout() {
        this.app.logout();
        this.authGuard.checkLogin("/main");
    }
}