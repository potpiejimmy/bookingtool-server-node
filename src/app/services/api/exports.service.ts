import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';
import { AppService } from "../app.service";

@Injectable()
export class ExportsService {

    private url: string = '/pt2/api/exports/';  // URL to web api

    constructor(public app: AppService,
                private http: AuthHttp,
                private loginService : LoginService) {
    }    
    
    startDownload(blob: any, filename: string) {
        var link=document.createElement('a');
        link.style.display="none";
        link.href=window.URL.createObjectURL(blob);
        link.download=filename+".xlsx";
        document.body.appendChild(link);
        link.click();
        setTimeout(()=>{
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 500);
    }

    getExcelForName(weeksToExport: number): Promise<any> {
        return this.http.getBlob(this.url+"?weeks="+weeksToExport).then(blob => {
            this.startDownload(blob, "bookings_"+this.app.loginService.loginToken.name);
        });
    }

    getExcelForProject(projectId: number, monthsToExport: number): Promise<any> {
        return this.http.getBlob(this.url+"project?id="+projectId+"&months="+monthsToExport).then(blob => {
            this.startDownload(blob, "project_"+projectId);
        });
    }
}