export function getTodaysIndex() {
    return [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
}