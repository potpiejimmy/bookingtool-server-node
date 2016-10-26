import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import * as Utils from '../../util/utils';

@Component({
  selector: 'maininput-edit',
  templateUrl: 'pt/client/pages/maininput/maininput.edit.html'
})
export class MainInputEditComponent {

    @ViewChild('minutesInputField') minutesInputField;

    @Input() set template(template:any) {
        this._template = template;
        // set focus whenever the template is set
        this.minutesInputField.nativeElement.focus();
    };
    get template() { return this._template; }

    @Input() set booking(booking: any) {
        this._booking = booking;
        this._minutes = booking.minutes ? "" + booking.minutes : null; 
        this.updateChart();
    }
    get booking() { return this._booking; }

    @Output() onCancel = new EventEmitter<any>();
    @Output() onSave = new EventEmitter<any>();

    _template: any;
    _booking: any;
    _minutes: string;

    budget: any = {minutes: 1440, used: 120, name: 'Release 13.1 > Change Requests > SR #1235456 PIN Change'};

    updateChart() {
        let chart = {data: [], backgroundColor: this.pieChartColors};
        let used: number = this.budget.used + this.minutesAsInt();
        chart.data.push(used);
        if (used > this.budget.minutes) chart.data.push(0);
        else chart.data.push(this.budget.minutes - used);
        this.pieChart.data.datasets[0] = chart;
    }

    budgetPercentageString(): string {
        return Utils.roundToPrecision((this.budget.used + this.minutesAsInt()) * 100 / this.budget.minutes, 0) + "%";
    }

    budgetHoursLeftString(): string {
        let left: number = this.budget.minutes - (this.budget.used + this.minutesAsInt());
        if (left < 0) 
            return Utils.formattedHoursForMinutes(-left) + " overrun";
        else
            return Utils.formattedHoursForMinutes(left) + " left";
    }

    minutesAsInt(): number {
        return this._minutes && this._minutes.length > 0 ? parseInt(this._minutes) : 0;
    }

    formattedHours(): string {
        return Utils.formattedHoursForMinutes(this.minutesAsInt());
    }

    get salesRepDisabled(): boolean {
        return this._template.sales_representative && this._template.sales_representative.length > 0;
    }

    cancel() {
        this.onCancel.emit();
    }

    save() {
        this._booking.minutes = this.minutesAsInt();
        this.onSave.emit();
    }

    get minutes(): string {
        return this._minutes;
    }

    set minutes(minutes: string) {
        this._minutes = minutes;
        this.updateChart();
    }

    // ----------- CHART PROPERTIES

    pieChartColors = ["#FF6384","#CACACA"];

    pieChart = {
        data: { labels: [], datasets: [ { data: [], backgroundColor: this.pieChartColors } ] },
        options: { title: { display: false }, legend: { display: false }, tooltips: {enabled: false}}
    }
}