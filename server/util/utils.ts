export function timePeriodForMonth(year:number, month:number) {
    let from = new Date();
    from.setDate(1);
    from.setMonth(month);
    from.setFullYear(year);
    removeTimeFromDate(from);

    let to = new Date(from.getTime());
    to.setMonth(to.getMonth()+1);
    return {from:from, to:to};
}

export function removeTimeFromDate(d: Date): Date {
    d.setMilliseconds(0);
    d.setSeconds(0);
    d.setMinutes(0);
    d.setHours(0);
    return d;
}

export function asyncLoop(array: any[], iter: (element: any, next: () => void) => void, complete: () => void, index: number = 0) {
    if (index >= array.length) complete();
    else iter(array[index], () => asyncLoop(array, iter, complete, ++index));
}

export function asyncLoopP(array: any[], iter: (element: any, next: () => void) => void): Promise<any> {
    return new Promise((resolve, reject) => asyncLoop(array, iter, () => resolve()));
}

export function asyncWhile(condition: () => boolean, iter: (next: () => void) => void, complete: () => void) {
    if (!condition()) complete();
    else iter(() => asyncWhile(condition, iter, complete));
}

export function asyncWhileP(condition: () => boolean, iter: (next: () => void) => void): Promise<any> {
    return new Promise((resolve, reject) => asyncWhile(condition, iter, () => resolve()));
}