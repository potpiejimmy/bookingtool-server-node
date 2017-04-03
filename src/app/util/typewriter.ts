import {Observable} from 'rxjs/Observable';

export class TypeWriter {

    currentIndex: number = 0;
    currentLength: number = 0;
    currentDir: boolean = false;
    stopAtIndex: number = -1;

    constructor(private phrases: string[]) {
    }

    start() {
        return new Observable<string>(observer => {
            this.next(observer, 250);
        });
    }

    stopAt(index:number) {
        this.stopAtIndex = index;
    }

    next(observer, waitTime) {
        setTimeout(() => {
            if (this.currentDir) this.currentLength--;
            else this.currentLength++;

            let waitMs = this.currentDir ? 32 : Math.random() * 128;
            let doContinue = true;

            if (!this.currentDir && this.currentLength == this.phrases[this.currentIndex].length) {
                this.currentDir = true;
                waitMs = 3000;
                if (this.currentIndex == this.stopAtIndex) doContinue = false;
            } else if (this.currentDir && this.currentLength == 0) {
                this.currentDir = false;
                this.currentIndex++;
                if (this.currentIndex == this.phrases.length) this.currentIndex = 0;
            }
            observer.next(this.phrases[this.currentIndex].substr(0,this.currentLength) + (this.currentLength == this.phrases[this.currentIndex].length ? '' : '\u007C'));
            if (doContinue) this.next(observer, waitMs);
            else observer.complete();
        }, waitTime);
    }
}