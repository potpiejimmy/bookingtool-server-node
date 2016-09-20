import { NgModule }      from '@angular/core';

import { routing } from './app.routing';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AuthGuard } from './services/authguard.service';
import { LoginService }  from './services/login.service';

import { DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule, CalendarModule } from 'primeng/primeng';

import { AppComponent }       from './app.component';
import { LoginComponent }     from './pages/login/login.component';
import { MainInputComponent } from './pages/maininput/maininput.component';
import { ExportComponent }    from './pages/export/export.component';

@NgModule({
  imports:      [
    routing,
    /* Angular 2 */ BrowserModule, FormsModule, HttpModule,
    /* PrimeNG   */ DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule, CalendarModule
  ],
  declarations: [ AppComponent, LoginComponent, MainInputComponent, ExportComponent ],
  providers: [
     AuthGuard,
     LoginService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 
}