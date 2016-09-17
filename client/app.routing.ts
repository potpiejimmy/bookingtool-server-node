import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainInputComponent }   from './pages/maininput/maininput.component';
import { ExportComponent }      from './pages/export/export.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainInputComponent
  },
  {
    path: 'export',
    component: ExportComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);