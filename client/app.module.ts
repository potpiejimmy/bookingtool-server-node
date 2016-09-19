import { NgModule }      from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { routing } from './app.routing';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AuthGuard } from './services/authguard.service';
import { LoginService }  from './services/login.service';

import { DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule } from 'primeng/primeng';

import { AppComponent }         from './app.component';
import { LoginComponent }   from './pages/login/login.component';
import { MainInputComponent }   from './pages/maininput/maininput.component';
import { ExportComponent }      from './pages/export/export.component';

@NgModule({
  imports:      [
    routing,
    BrowserModule,
    HttpModule,
    DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule
  ],
  declarations: [ AppComponent, LoginComponent, MainInputComponent, ExportComponent ],
  providers: [
     {provide: LocationStrategy, useClass: HashLocationStrategy},
     AuthGuard,
     LoginService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 
}