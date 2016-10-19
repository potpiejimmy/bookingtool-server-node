import { Component } from '@angular/core';
import 'rxjs/Rx';
import { BookingsService } from '../../services/bookings.service';

@Component({
  selector: 'maininput',
  templateUrl: 'pt/client/pages/maininput/maininput.html'
})
export class MainInputComponent {

    bookings = [];
    current = {"day": Date.now()};
    currentYearMonth = -1;

    constructor(private bookingsService : BookingsService) { }

    ngOnInit() {
        this.loadBookings();
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
                pieChartData.datasets[0].backgroundColor = ["lightGray"];
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
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return ("0"+d.getDate()).substr(-2) + " " + months[d.getMonth()] + " " + d.getFullYear(); 
    }

    get currentDay():string {
        return this.formatDate(this.current.day) + "                        :" + this.current.day;
    }

    set currentDay(d:string) {
        this.current.day = parseInt(d.substr(d.indexOf(":")+1));
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

    footerRows = [{columns:[{footer:'Total:',colspan:6},{footer:'0h'},{footer:''}]}];

}
