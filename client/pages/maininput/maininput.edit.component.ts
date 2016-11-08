import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import * as Utils from '../../util/utils';
import { BudgetsService }  from '../../services/api/budgets.service';

@Component({
  selector: 'maininput-edit',
  templateUrl: 'pt2/client/pages/maininput/maininput.edit.html'
})
export class MainInputEditComponent {

    @ViewChild('minutesInputField') minutesInputField;
    @ViewChild('salesInfoInputField') salesInfoInputField;

    @Input() set template(template:any) {
        this._template = template;
        this.budgetInfo = { budget: {} };
        this.fetchBudgetInfo();
    };
    get template() { return this._template; }

    @Input() set booking(booking: any) {
        this._booking = booking;
        this._minutes = booking.minutes ? "" + booking.minutes : null;
        // if editing, take into account that booking.minutes is already contained in the budget info
        if (booking.id) this._minutesAlreadyOnBudget = booking.minutes;
        else this._minutesAlreadyOnBudget = 0;
        // set input focus whenever a new booking is set
        this.setInputFocus();
    }
    get booking() { return this._booking; }

    @Output() onCancel = new EventEmitter<any>();
    @Output() onSave = new EventEmitter<any>();

    _template: any;
    _booking: any;
    _minutes: string;
    _minutesAlreadyOnBudget: number;

    budgetInfo: any = { budget: {} };

    constructor(private budgetsService: BudgetsService) {}

    setInputFocus() {
        if (this._booking.sales_representative && this._booking.sales_representative.length > 0)
            this.minutesInputField.nativeElement.focus();
        else
            this.salesInfoInputField.nativeElement.focus();
    }

    fetchBudgetInfo() {
        this.budgetsService.getBudgetInfo(this._template.budget_id).then(b => {
            this.budgetInfo = b
            this.updateChart();
        });
    }

    usedMinutesOnBudget(): number {
        return this.budgetInfo.booked_minutes_recursive - this._minutesAlreadyOnBudget + this.minutesAsInt();
    }

    updateChart() {
        let chart = {data: [], backgroundColor: this.pieChartColors};
        let used: number = this.usedMinutesOnBudget();
        chart.data.push(used);
        if (used > Math.abs(this.budgetInfo.budget.minutes)) chart.data.push(0);
        else chart.data.push(Math.abs(this.budgetInfo.budget.minutes) - used);
        this.pieChart.data.datasets[0] = chart;
    }

    budgetPercentageString(): string {
        return Utils.roundToPrecision(this.usedMinutesOnBudget() * 100 / Math.abs(this.budgetInfo.budget.minutes), 0) + "%";
    }

    budgetHoursLeftString(): string {
        let left: number = Math.abs(this.budgetInfo.budget.minutes) - this.usedMinutesOnBudget();
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