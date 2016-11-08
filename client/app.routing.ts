import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent }   from './pages/about/about.component';
import { LoginComponent }   from './pages/login/login.component';
import { PasswordChangeComponent }   from './pages/pwchange/pwchange.component';
import { MainInputComponent }   from './pages/maininput/maininput.component';
import { ExportComponent }      from './pages/export/export.component';

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
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);