import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DataTableModule } from 'primeng/primeng';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule, DataTableModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }