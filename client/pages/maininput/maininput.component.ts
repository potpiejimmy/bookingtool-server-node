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

    constructor(private bookingsService : BookingsService) { }

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.bookingsService.getBookings(this.current.day).then(
            res => {
                this.bookings = res;
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
        console.info("Date changed to: "+newValue);
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
        console.info("set date " + this.current.day);
    }


    // ----------- DUMMY PROPERTIES FOR TESTING

    pieChartDataProjects = {
        data: {
                labels: ['Project A','Project B','Project C','Project D','Project E','Project F'],
                datasets: [ {
                        data: [300, 50, 100, 10, 50, 80],
                        backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#886384","#36A288","#66CE56"]
                    }]    
        },
        options: {
            title: {
                display: true,
                text: 'By Project',
                fontSize: 16
            },
            legend: {
                position: 'right'
            }
        }
    }

    pieChartDataWorkTime = {
        data: {
                labels: ['NP','0W'],
                datasets: [ {
                        data: [300, 10],
                        backgroundColor: ["#FF6384","#FFCE56"]
                    }]    
        },
        options: {
            title: {
                display: true,
                text: 'By Work Time',
                fontSize: 16
            },
            legend: {
                position: 'right'
            }
        }
    }

    footerRows = [{columns:[{footer:'Total:',colspan:6},{footer:'0h'},{footer:''}]}];

}
