import { Component, ViewChild, AfterViewInit } from '@angular/core';
import 'rxjs/Rx';
import { BookingsService } from '../../services/api/bookings.service';
import { TemplatesService } from '../../services/api/templates.service';

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];    
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

@Component({
  selector: 'maininput',
  templateUrl: 'pt/client/pages/maininput/maininput.html'
})
export class MainInputComponent implements AfterViewInit {

    @ViewChild('searchTemplateField') searchTemplateField;

    bookings = [];
    current = {"day": Date.now()};
    currentTemplate;
    currentYearMonth:number = -1;
    chartsTitle:string;
    autoCompleteResults;
    autoCompleteResultsTemplates;

    constructor(private bookingsService: BookingsService, private templatesService: TemplatesService) { }

    ngOnInit() {
        this.loadBookings();
    }

    ngAfterViewInit() {
        //this.searchTemplateField.nativeElement.focus(); // XXX does not work with p-autocomplete
    }

    loadBookings() {
        this.bookingsService.getBookings(this.current.day).then(res => {
            this.bookings = res;
        });
        this.checkUpdateCharts();
    }

    checkUpdateCharts() {
        // only update if month changed:
        let d = new Date(this.current.day);
        let yearMonth = d.getFullYear()*100+d.getMonth();
        if (this.currentYearMonth != yearMonth) {
            this.currentYearMonth = yearMonth;
            this.updateCharts(d.getFullYear(), d.getMonth());
        }
    }

    updateCharts(year:number, month:number) {
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
        let d = new Date(this.current.day);
        d.setDate(d.getDate() + offset);
        this.current.day = d.getTime();
    }

    edit(row) {
        console.info(JSON.stringify(row));
    }

    dateChanged(newValue) {
        this.loadBookings();
    }

    formatDate(date):string {
        let d = new Date(date);
        return WEEKDAYS[d.getDay()] + ", " + ("0"+d.getDate()).substr(-2) + " " + MONTHS[d.getMonth()].substr(0,3) + " " + d.getFullYear(); 
    }

    get currentDay():string {
        return this.formatDate(this.current.day) + "                            :" + this.current.day;
    }

    set currentDay(d:string) {
        this.current.day = parseInt(d.substr(d.indexOf(":")+1));
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
                if (i.search_string == t) this.currentTemplate = i;
            })
        }
    }

    cancelEdit() {
        this.currentTemplate = null;
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

    footerRows = [{columns:[{footer:'Total:',colspan:6},{footer:'0 h'},{footer:''}]}];

}
