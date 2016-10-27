import { Injectable }    from '@angular/core';
import { AuthHttp } from '../authhttp.service';
import { LoginService } from '../login.service';

@Injectable()
export class BudgetsService {

    private url: string = '/pt/api/budgets/';  // URL to web api

    constructor(private http: AuthHttp, private loginService : LoginService) {
    }    
    
    getBudgetInfo(budgetId: number): Promise<any> {
        return this.http.get(this.url+budgetId);
    }
}