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
    @Output() onSave = new EventEmitter<any>();

    ngOnInit() {
        this.minutesInputField.nativeElement.focus();
        console.info("TEMPLATE", JSON.stringify(this.template));
    }

    cancel() {
        this.onCancel.emit();
    }

    save() {
        this.onSave.emit();
    }
}