import { Component } from '@angular/core';
import { ExportsService } from 'app/services/api/exports.service';
import { AppService } from "app/services/app.service";

@Component({
  selector: 'export',
  templateUrl: 'export.html'
})
export class ExportComponent {

  constructor(public app: AppService,
              private exportsService: ExportsService) {}

  public weeksToExport: number = 1;
  public monthsToExport: number = 0;
  public projectToExport: number = -1;

  public managedProjectItems = [{label:'FI Release 17.0'},{label:'Royal Bank of Scotland (RBS)'}];

  export() {
    this.exportsService.getExcelForName(2);
  }
}
