import cors from "cors";
import { Router } from "express";
import { archiver } from "..";
import { getWeekNumber, parseDate } from "../utils";
import { apiResponse } from "./apiResponse";

const api = Router();
api.use(cors());

api.get("/menu", async(req, res) => {
    // If no query params, return menu for the current week
    if (Object.keys(req.query).length <= 0) {
        const result = await archiver?.query({ query: { week: { weekNumber: getWeekNumber(), year: new Date().getFullYear()}}});
        return apiResponse(res, 400, { result });
    }

    if ("date" in req.query) return console.log("date jee");
    if ("start" in req.query && "end" in req.query) return console.log("date jee");

    const { start, end, date} = req.query;

    if (typeof start != "string" || typeof end != "string") return apiResponse(res, 400);
    if (typeof date != "string") return apiResponse(res, 400);

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (!(startDate && endDate)) return apiResponse(res, 422);

    console.log(startDate.toLocaleDateString(), endDate.toLocaleDateString());

    const result = await archiver?.query({ query: { date: parseDate(date) } });
    apiResponse(res, 200, { result });
});

export default api;