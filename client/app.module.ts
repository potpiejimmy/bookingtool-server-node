import { NgModule }      from '@angular/core';

import { routing } from './app.routing';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

import { AuthGuard } from './services/authguard.service';
import { LoginService }  from './services/login.service';
import { AuthHttp }  from './services/authhttp.service';
import { BookingsService }  from './services/api/bookings.service';
import { TemplatesService }  from './services/api/templates.service';

import { DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule,
         CalendarModule, PasswordModule, MessagesModule, ChartModule, AutoCompleteModule,
         ConfirmDialogModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';

import { AppComponent }       from './app.component';
import { LoginComponent }     from './pages/login/login.component';
import { MainInputComponent } from './pages/maininput/maininput.component';
import { MainInputEditComponent } from './pages/maininput/maininput.edit.component';
import { ExportComponent }    from './pages/export/export.component';

@NgModule({
  imports:      [
    routing,
    /* Angular 2 */ BrowserModule, FormsModule, HttpModule,
    /* PrimeNG   */ DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule,
                    CalendarModule, PasswordModule, MessagesModule, ChartModule, AutoCompleteModule,
                    ConfirmDialogModule
  ],
  declarations: [
     AppComponent,
     LoginComponent,
     MainInputComponent, MainInputEditComponent,
     ExportComponent
  ],
  providers: [
     AuthGuard,
     LoginService,
     AuthHttp,
     BookingsService, TemplatesService,
     /* PrimeNG */ ConfirmationService,
     LocalStorageService, { provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: { prefix: 'bookingtool', storageType: 'sessionStorage' } }
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 
}