import { Component } from '@angular/core';
import { ExportsService } from '../../services/api/exports.service';

@Component({
  selector: 'export',
  templateUrl: 'export.html'
})
export class ExportComponent {

  constructor(private exportsService: ExportsService) {}

  export() {
    this.exportsService.getExcelForName(2);
  }
}
