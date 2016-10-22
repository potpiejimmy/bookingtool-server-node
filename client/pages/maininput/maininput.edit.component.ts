import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/Rx';

@Component({
  selector: 'maininput-edit',
  templateUrl: 'pt/client/pages/maininput/maininput.edit.html'
})
export class MainInputEditComponent {

    @ViewChild('minutesInputField') minutesInputField;

    _template: any;
    @Input() set template(template:any) {
        this._template = template;
        // set focus whenever the template is set
        this.minutesInputField.nativeElement.focus();
    };
    get template() { return this._template; }

    @Input() booking: any;

    @Output() onCancel = new EventEmitter<any>();
    @Output() onSave = new EventEmitter<any>();

    cancel() {
        this.onCancel.emit();
    }

    save() {
        this.onSave.emit();
    }
}