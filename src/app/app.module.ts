import { NgModule }      from '@angular/core';

import { routing } from './app.routing';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LocalStorageModule } from 'angular-2-local-storage';

import { AuthGuard } from './services/authguard.service';
import { AppService } from './services/app.service';
import { LoginService }  from './services/login.service';
import { AuthHttp }  from './services/authhttp.service';
import { BookingsService }  from './services/api/bookings.service';
import { TemplatesService }  from './services/api/templates.service';
import { BudgetsService }  from './services/api/budgets.service';
import { UsersService }  from './services/api/users.service';
import { ExportsService }  from './services/api/exports.service';

import { DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule,
         CalendarModule, PasswordModule, MessagesModule, ChartModule, AutoCompleteModule,
         ConfirmDialogModule, OverlayPanelModule, FieldsetModule, SpinnerModule, DropdownModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';

import { AppComponent }       from './app.component';
import { AboutComponent }     from './pages/about/about.component';
import { LoginComponent }     from './pages/login/login.component';
import { PasswordChangeComponent }   from './pages/pwchange/pwchange.component';
import { MainInputComponent } from './pages/maininput/maininput.component';
import { MainInputEditComponent } from './pages/maininput/maininput.edit.component';
import { ExportComponent }    from './pages/export/export.component';
import { DomainsComponent }    from './pages/domains/domains.component';
import { ProjectsComponent }    from './pages/projects/projects.component';
import { BudgetsComponent }    from './pages/budgets/budgets.component';
import { TemplatesComponent }    from './pages/templates/templates.component';
import { AdminFIComponent }    from './pages/adminfi/adminfi.component';
import { BudgetControlComponent }    from './pages/budgetcontrol/budgetcontrol.component';
import { BudgetPlansComponent }    from './pages/budgetplans/budgetplans.component';
import { ForecastsComponent }    from './pages/forecasts/forecasts.component';

@NgModule({
  imports:      [
    routing,
    LocalStorageModule.withConfig({ prefix: 'bookingtool', storageType: 'sessionStorage' }),
    /* Angular 2 */ BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule,
    /* PrimeNG   */ DataTableModule, TabMenuModule, InputTextModule, ButtonModule, PanelModule,
                    CalendarModule, PasswordModule, MessagesModule, ChartModule, AutoCompleteModule,
                    ConfirmDialogModule, OverlayPanelModule, FieldsetModule, SpinnerModule, DropdownModule
  ],
  declarations: [
     AppComponent,
     AboutComponent,
     LoginComponent,
     PasswordChangeComponent,
     MainInputComponent, MainInputEditComponent,
     ExportComponent,
     DomainsComponent,
     ProjectsComponent,
     BudgetsComponent,
     TemplatesComponent,
     AdminFIComponent,
     BudgetControlComponent,
     BudgetPlansComponent,
     ForecastsComponent
  ],
  providers: [
     AuthGuard, AppService, LoginService, AuthHttp,
     /* API     */ BookingsService, TemplatesService, BudgetsService, UsersService, ExportsService,
     /* PrimeNG */ ConfirmationService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 
}