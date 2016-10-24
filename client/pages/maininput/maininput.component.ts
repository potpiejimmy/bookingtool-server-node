import { Component, ViewChild, AfterViewInit } from '@angular/core';
import 'rxjs/Rx';
import { BookingsService } from '../../services/api/bookings.service';
import { TemplatesService } from '../../services/api/templates.service';
import { ConfirmationService } from 'primeng/primeng';

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];    
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

@Component({
  selector: 'maininput',
  templateUrl: 'pt/client/pages/maininput/maininput.html'
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
    testDay: Date;

    constructor(private bookingsService: BookingsService,
                private templatesService: TemplatesService,
                private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.loadBookings();
    }

    ngAfterViewInit() {
        //this.searchTemplateField.nativeElement.focus(); // XXX does not work with p-autocomplete
    }

    loadBookings() {
        this.bookingsService.getBookings(this.current.day.getTime()).then(res => {
            this.bookings = res;
        });
        this.checkUpdateCharts();
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
        this.chartsTitle = "Your bookings in " + MONTHS[month] + " " + year;
        this.updateChart(year, month, 0, this.pieChartDataWorkTime.data);
        this.updateChart(year, month, 1, this.pieChartDataProjects.data);
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
                res.forEach(e => {
                    pieChartData.labels.push(e.label);
                    pieChartData.datasets[0].data.push(e.minutes);
                });
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

    edit(row) {
        console.info(JSON.stringify(row));
    }

    delete(row) {
        this.confirmationService.confirm({
            message: "Really delete?",
            accept: () => { /* TODO */ }
        });
    }

    formatDate(date):string {
        let d = new Date(date);
        return WEEKDAYS[d.getDay()] + ", " + ("0"+d.getDate()).substr(-2) + " " + MONTHS[d.getMonth()].substr(0,3) + " " + d.getFullYear(); 
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
    }

    save() {
        this.currentTemplate = null;
        this.bookingsService.saveBooking(this.current).then(()=>{
            this.cancel();
            this.currentYearMonth = -1; // force updating of charts
            this.loadBookings();
        });
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

    footerRows = [{columns:[{footer:'',colspan:6},{footer:'0 h'},{footer:''}]}];

}
