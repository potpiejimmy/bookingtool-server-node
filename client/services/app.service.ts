import { Injectable }    from '@angular/core';
import { Message }  from 'primeng/primeng';

@Injectable()
export class AppService {

    messages: Message[];

    setMessage(summary: string, detail: string, severity: string = "error") {
        this.clearMessages();
        this.messages.push({severity: severity, summary: summary, detail: detail});
    }

    clearMessages() {
        this.messages = [];
    }
}