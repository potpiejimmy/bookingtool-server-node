import { Injectable }    from '@angular/core';
import { Message }  from 'primeng/primeng';
import { LoginService } from './login.service';

@Injectable()
export class AppService {

    messages: Message[];

    constructor(public loginService: LoginService) {}

    setMessage(summary: string, detail: string, severity: string = "error") {
        this.clearMessages();
        this.messages.push({severity: severity, summary: summary, detail: detail});
    }

    clearMessages() {
        this.messages = [];
    }

    logout(): void {
        this.loginService.logout();
        this.clearMessages();
    }

}