import { NgModule }      from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { routing } from './app.routing';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { LoginService }  from './services/login.service';

import { DataTableModule }      from 'primeng/primeng';
import { TabMenuModule }        from 'primeng/primeng';

import { AppComponent }         from './app.component';
import { MainInputComponent }   from './pages/maininput/maininput.component';
import { ExportComponent }      from './pages/export/export.component';

@NgModule({
  imports:      [
    routing,
    BrowserModule,
    HttpModule,
    DataTableModule,
    TabMenuModule
  ],
  declarations: [ AppComponent, MainInputComponent, ExportComponent ],
  providers: [
     {provide: LocationStrategy, useClass: HashLocationStrategy},
     LoginService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 
}