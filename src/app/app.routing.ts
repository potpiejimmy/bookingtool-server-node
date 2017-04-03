import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent }   from './pages/about/about.component';
import { LoginComponent }   from './pages/login/login.component';
import { PasswordChangeComponent }   from './pages/pwchange/pwchange.component';
import { MainInputComponent }   from './pages/maininput/maininput.component';
import { ExportComponent }      from './pages/export/export.component';
import { DomainsComponent }      from './pages/domains/domains.component';
import { ProjectsComponent }    from './pages/projects/projects.component';
import { BudgetsComponent }    from './pages/budgets/budgets.component';
import { TemplatesComponent }    from './pages/templates/templates.component';
import { AdminFIComponent }    from './pages/adminfi/adminfi.component';
import { BudgetControlComponent }    from './pages/budgetcontrol/budgetcontrol.component';
import { BudgetPlansComponent }    from './pages/budgetplans/budgetplans.component';
import { ForecastsComponent }    from './pages/forecasts/forecasts.component';

import { AuthGuard } from './services/authguard.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'pwchange',
    component: PasswordChangeComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'main',
    component: MainInputComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'export',
    component: ExportComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'domains',
    component: DomainsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'budgets',
    component: BudgetsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'templates',
    component: TemplatesComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'adminfi',
    component: AdminFIComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'budgetcontrol',
    component: BudgetControlComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'budgetplans',
    component: BudgetPlansComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'forecasts',
    component: ForecastsComponent,
    canActivate: [ AuthGuard ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);