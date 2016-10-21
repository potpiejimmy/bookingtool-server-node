import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/Rx';

@Component({
  selector: 'maininput-edit',
  templateUrl: 'pt/client/pages/maininput/maininput.edit.html'
})
export class MainInputEditComponent {

    @ViewChild('minutesInputField') minutesInputField;

    @Input() template: any;
    @Input() booking: any;
    @Output() onCancel = new EventEmitter<any>();

    ngOnInit() {
        this.minutesInputField.nativeElement.focus();
    }

    cancel() {
        this.onCancel.emit();
    }
}