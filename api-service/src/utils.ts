export function getCurrentDayIndex() {
    return [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
}

export function jsonPrettyPrinter(jsonObj: object) {
    return JSON.stringify(jsonObj, null, 4);
}

export function isProduction() {
    return process.env.NODE_ENV == "production";
}

export function parseDate(dateStr: string) {
    const [ dayStr, monthStr, yearStr ] = dateStr.split(".");

    if (
        !(isValidDigit(dayStr) && isValidDigit(monthStr) && isValidDigit(yearStr, 4, 4))
    ) return;

    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    return new Date(year, month - 1, day);
}

export function isValidDigit(digitStr: string, minAllowedLength = 1, maxAllowedLength = 2) {
    return new RegExp(`^[0-9]{${minAllowedLength},${maxAllowedLength}}$`).test(digitStr);
}

export function isValidDateString(date: string) {
    return new Date(date).toString() != "Invalid Date";
}

/**
 * 
 * @param date Original Date
 * @param days Amount of days to add
 * @returns A new `Date` object with the days added
 */
export function addDaysToDate(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function getDateOfISOWeek(week: number, year: number) {
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}