export function timePeriodForMonth(year:number, month:number) {
    let from = new Date();
    from.setFullYear(year);
    from.setMonth(month);
    from.setDate(1);
    removeTimeFromDate(from);

    let to = new Date(from.getTime());
    to.setMonth(to.getMonth()+1);
    return {from:from, to:to};
}

export function removeTimeFromDate(d: Date): Date {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}