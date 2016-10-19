export function timePeriodForMonth(year:number, month:number) {
    let from = new Date();
    from.setFullYear(year);
    from.setMonth(month);
    from.setDate(1);
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);
    from.setMilliseconds(0);

    let to = new Date(from.getTime());
    to.setMonth(to.getMonth()+1);
    return {from:from, to:to};
}