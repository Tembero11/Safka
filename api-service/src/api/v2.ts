import cors from "cors";
import { Router } from "express";
import { archiver } from "..";
import { DatabaseQuery } from "../database/dbTypes";
import { getWeekNumber, parseDate } from "../utils";
import { apiResponse } from "./apiResponse";

const api = Router();
api.use(cors());

api.get("/menu", async(req, res) => {
    if (Object.keys(req.query).length <= 0) {
        const result = await archiver?.query({week: { weekNumber: getWeekNumber()}}  as DatabaseQuery);
        apiResponse(res, 400, { result });
    } else {
        // const { start, end, date} = req.query;

        // if (typeof start != "string" || typeof end != "string") return apiResponse(res, 400);
        // if (typeof date != "string") return apiResponse(res, 400);

        // const startDate = parseDate(start);
        // const endDate = parseDate(end);

        // if (!(startDate && endDate)) return apiResponse(res, 422);

        // console.log(start, end);
        // console.log(end);
        // console.log(startDate.toLocaleDateString(), endDate.toLocaleDateString());

        const date = req.query.date as string;
        const result = await archiver?.query({date: parseDate(date)} as DatabaseQuery);
        apiResponse(res, 200, { result });

        console.log(date);
    }
});

export default api;