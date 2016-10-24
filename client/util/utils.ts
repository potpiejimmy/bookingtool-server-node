export function roundToPrecision(value: number, decimalPrecision: number): number {
    let precision = Math.pow(10, decimalPrecision);
    return Math.round(value*precision)/precision;
}

export function formattedHoursForMinutes(minutes: number) {
    return roundToPrecision(minutes/60, 2).toLocaleString() + " h";
}