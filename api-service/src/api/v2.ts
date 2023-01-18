import cors from "cors";
import { Router } from "express";
import { parseDate } from "../utils";
import { apiResponse } from "./apiResponse";

const api = Router();
api.use(cors());

api.get("/menu", (req, res) => {
    const { start, end } = req.query;

    if (typeof start != "string" || typeof end != "string") return apiResponse(res, 400);

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (!(startDate && endDate)) return apiResponse(res, 422);

    console.log(start, end);
    console.log(startDate.toLocaleDateString(), endDate.toLocaleDateString());

    apiResponse(res, 200);
});

export default api;