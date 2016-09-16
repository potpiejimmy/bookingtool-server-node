import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { LoginService }  from './services/login.service';

import { DataTableModule } from 'primeng/primeng';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [
    BrowserModule,
    HttpModule,
    DataTableModule
  ],
  declarations: [ AppComponent ],
  providers: [ LoginService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }