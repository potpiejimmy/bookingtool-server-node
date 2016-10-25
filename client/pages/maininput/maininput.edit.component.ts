import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import * as Utils from '../../util/utils';

@Component({
  selector: 'maininput-edit',
  templateUrl: 'pt/client/pages/maininput/maininput.edit.html'
})
export class MainInputEditComponent {

    @ViewChild('minutesInputField') minutesInputField;

    _template: any;
    @Input() set template(template:any) {
        this._template = template;
        // set focus whenever the template is set
        this.minutesInputField.nativeElement.focus();
    };
    get template() { return this._template; }

    @Input() booking: any;

    @Output() onCancel = new EventEmitter<any>();
    @Output() onSave = new EventEmitter<any>();

    formattedHours(minutes: number): string {
        return Utils.formattedHoursForMinutes(minutes);
    }

    get salesRepDisabled(): boolean {
        return this._template.sales_representative && this._template.sales_representative.length > 0;
    }

    cancel() {
        this.onCancel.emit();
    }

    save() {
        this.onSave.emit();
    }

    // ----------- CHART PROPERTIES

    pieChartColors = ["#FF6384","#CACACA"];

    pieChart = {
        data: { labels: [], datasets: [ { data: [13, 87], backgroundColor: this.pieChartColors } ] },
        options: { title: { display: false, text: '13%', fontSize: 14, position: 'right' }, legend: { display: false }, tooltips: {enabled: false}}
    }
}