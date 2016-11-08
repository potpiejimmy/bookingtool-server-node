import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { BookingsService } from '../../services/api/bookings.service';
import { TemplatesService } from '../../services/api/templates.service';
import { ConfirmationService } from 'primeng/primeng';
import * as Utils from '../../util/utils';

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];    

@Component({
  selector: 'maininput',
  templateUrl: 'pt2/client/pages/maininput/maininput.html'
})
export class MainInputComponent implements AfterViewInit {

    @ViewChild('searchTemplateField') searchTemplateField;

    bookings = [];
    current: any = {day: new Date()};
    currentTemplate;
    currentYearMonth:number = -1;
    chartsTitle:string;
    autoCompleteResults;
    autoCompleteResultsTemplates;
    sumMinutes: number;
    quickSelectionList: any[];
    quickSelectionListSize: number = 10;
    quickSelection: any;

    constructor(private app: AppService,
                private bookingsService: BookingsService,
                private templatesService: TemplatesService,
                private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.refresh();
    }

    ngAfterViewInit() {
        this.focusSearchField();
    }

    focusSearchField() {
        // focus autocomplete input field:
        this.searchTemplateField.nativeElement.firstElementChild.firstElementChild.firstElementChild.focus();
    }

    loadBookings() {
        this.bookingsService.getBookings(this.current.day.getTime()).then(res => {
            this.bookings = res;
            this.sumMinutes = 0;
            res.forEach(e => this.sumMinutes += e.minutes);
            this.focusSearchField();
        });
        this.checkUpdateCharts();
    }

    loadQuickSelectionList() {
        this.templatesService.getLastUsedByPerson(this.quickSelectionListSize).then(res => {
            this.quickSelectionList = res
            this.quickSelectionListSize = Math.max(1, res.length);
        });
    }

    refresh() {
        this.currentYearMonth = -1; // force updating of charts
        this.loadBookings();
        this.loadQuickSelectionList();
    }

    checkUpdateCharts() {
        // only update if month changed:
        let month = this.current.day.getMonth();
        let year = this.current.day.getFullYear();
        let yearMonth = year * 100 + month;
        if (this.currentYearMonth != yearMonth) {
            this.currentYearMonth = yearMonth;
            this.updateCharts(year, month);
        }
    }

    updateCharts(year: number, month: number) {
        this.chartsTitle = "Your hours in " + MONTHS[month] + " " + year;
        this.updateChart(year, month, 0, this.pieChartDataWorkTime.data);
        this.updateChart(year, month, 1, this.pieChartDataProjects.data);
        this.updateChart(year, month, 2, this.barChartWorkTime.data);
    }

    updateChart(year:number, month:number, chartType:number, pieChartData) {
        this.bookingsService.getBookingSumsForMonth(year, month, chartType).then(res=> {
            pieChartData.labels = [];
            pieChartData.datasets[0] = {data:[],backgroundColor:this.chartBackgroundColors};
            if (res.length==0) {
                pieChartData.labels.push('No bookings');
                pieChartData.datasets[0].data.push(1);
                pieChartData.datasets[0].backgroundColor = ["#D3D3D3"];
            } else {
                if (chartType == 2) {
                    let diff: number = res[0].minutes - res[0].days * 8 * 60;
                    pieChartData.labels.push(res[0].days + " day(s)", (diff >= 0 ? "+" : "") + Utils.formattedHoursForMinutes(diff));
                    pieChartData.datasets[0].data.push(diff > 0 ? -res[0].days * 8 : res[0].days * 8, diff/60);
                    pieChartData.datasets[0].backgroundColor = diff >= 0 ?  ["#D3D3D3", "#66CE56"] : ["#D3D3D3", "#FF6384"];
                } else {
                    res.forEach(e => {
                        pieChartData.labels.push(chartType == 0 ? e.label + " " + Utils.labelForBookingType(e.label) : e.label);
                        pieChartData.datasets[0].data.push(e.minutes);
                    });
                }
            }
        });
    }

    nextDay() {
        this.updateCurrentDay(1);
        this.loadBookings();
    }

    previousDay() {
        this.updateCurrentDay(-1);
        this.loadBookings();
    }

    updateCurrentDay(offset: number) {
        let d = new Date(this.current.day.getTime());
        d.setDate(d.getDate() + offset);
        this.current.day = d;
    }

    dateChanged(newValue) {
        this.loadBookings();
    }

    onQuickSelectRow(event) {
        this.setCurrentTemplate(event.data);
        this.quickSelection = null; // deselect
    }

    edit(row) {
        this.current = JSON.parse(JSON.stringify(row));
        this.current.day = new Date(row.day);
        this.currentTemplate = row.booking_template; // starts editing
    }

    delete(row) {
        this.confirmationService.confirm({
            header: "Delete entry",
            message: "Really delete this entry?",
            accept: () => {
                this.cancel(); // cancel editing on delete
                this.bookingsService.deleteBooking(row.id).then(() => {
                    this.refresh();
                })
            }
        });
    }

    search(event) {
        this.templatesService.findBookingTemplates(event.query).then(data => {
            this.autoCompleteResultsTemplates = data;
            this.autoCompleteResults = [];
            data.forEach(i => this.autoCompleteResults.push(i.search_string));
        });
    }

    get currentTemplateString():string {
        return this.currentTemplate ? this.currentTemplate.search_string : null;
    }

    set currentTemplateString(t:string) {
        if (this.autoCompleteResultsTemplates) {
            this.autoCompleteResultsTemplates.forEach(i => {
                if (i.search_string == t) this.setCurrentTemplate(i);
            })
        }
    }

    setCurrentTemplate(t: any) {
        this.currentTemplate = t; // this starts the editing form
        this.current.booking_template_id = t.id;
        this.current.sales_representative = t.sales_representative;
        if (!this.current.id)
            this.current.description = t.description; // adapt description, but only for new bookings
    }

    cancel() {
        this.currentTemplate = null;
        this.current = {day: this.current.day};
        this.app.clearMessages();
        this.focusSearchField();
    }

    save() {
        this.bookingsService.saveBooking(this.current).then(()=>{
            this.cancel();
            this.refresh();
        });
    }

    formattedHours(minutes: number): string {
        return Utils.formattedHoursForMinutes(minutes);
    }

    get formattedTableSum(): string {
        return Utils.formattedHoursForMinutes(this.sumMinutes);
    }

    quickSelectionListSizeInc() {
        this.quickSelectionListSize++;
        this.loadQuickSelectionList();
    }

    quickSelectionListSizeDec() {
        this.quickSelectionListSize = Math.max(1, this.quickSelectionListSize-1);
        this.loadQuickSelectionList();
    }

    // ----------- CHART PROPERTIES

    chartBackgroundColors = ["#FF6384","#36A2EB","#FFCE56","#886384","#36A288","#66CE56"];

    pieChartDataProjects = {
        data: { labels: [], datasets: [ { data: [], backgroundColor: this.chartBackgroundColors } ] },
        options: { title: { display: true, text: 'By Project', fontSize: 14 }, legend: { position: 'right' }}
    }

    pieChartDataWorkTime = {
        data: { labels: [], datasets: [ { data: [], backgroundColor: this.chartBackgroundColors } ] },
        options: { title: { display: true, text: 'By Work Time', fontSize: 14 }, legend: { position: 'right' }}
    }

    barChartWorkTime = {
        data: { labels: [], datasets: [ { data: [], backgroundColor: this.chartBackgroundColors } ] },
        options: { title: { display: true, text: 'Your hours vs. 8h/day', fontSize: 14 }, legend: { display: false }}
    }
}

