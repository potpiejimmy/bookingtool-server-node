export function roundToPrecision(value: number, decimalPrecision: number): number {
    let precision = Math.pow(10, decimalPrecision);
    return Math.round(value*precision)/precision;
}

export function formattedHoursForMinutes(minutes: number) {
    return roundToPrecision(minutes/60, 2).toLocaleString() + " h";
}

export function labelForBookingType(type: string): string {
    switch(type) {
        case "0W": return "Working";
        case "1T": return "Travel";
        case "NP": return "Non Prod."
        default: return "";
    }
}