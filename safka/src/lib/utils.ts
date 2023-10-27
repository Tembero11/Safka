import { format } from "date-fns";

export function isProduction() {
    if (process.env.NODE_ENV !== "development") return true
    return false
}

export function getTodaysIndex() {
    return [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
}

export function formatDate(date: Date) {
    return format(date, "dd.MM.yyyy")
} 