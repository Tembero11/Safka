import { Request, Response } from "express";
import { z } from "zod";
import restaurants from "../../restaurants";
import { apiResponse } from "../apiResponse";
import { NextFunction } from "express";
import { parse, isValid, isAfter, differenceInBusinessDays } from "date-fns";

const restaurantIdSchema = z.number().min(0).max(restaurants.length-1);

/**
 * Safely validates restaurant id given as a request parameter.
 * 
 * If validation was NOT succesful, http code 400 with a message is responded. 
 *
 * If validation was succesful, the id will be stored into `res.locals.restaurantId`.
 */
export function validateRestaurantId(req: Request, res: Response, next: NextFunction) {
  const restaurantId = Number(req.params.restaurantId);

  const result = restaurantIdSchema.safeParse(restaurantId);
  if (!result.success) {
    return apiResponse(res, 400, { msg: "Invalid restaurant id" });
  }

  res.locals.restaurantId = restaurantId;
  next();
}

export function validateDateRange(req: Request, res: Response, next: NextFunction) {
  console.log(req.params);
  const startDate = parse(req.query.start as string, "dd.MM.yyyy", new Date());
  const endDate = parse(req.query.end as string, "dd.MM.yyyy", new Date());

  console.log("s", startDate, endDate);
  if (!isValid(startDate) || !isValid(endDate)) {
    return apiResponse(res, 400, { msg: "Invalid date given"});
  }

  if (isAfter(startDate, endDate)) {
    return apiResponse(res, 400, { msg: "Invalid date range given (end should be later than start)"});
  }

  const durationInDays = differenceInBusinessDays(endDate, startDate);
  if (durationInDays > 14) {
    return apiResponse(res, 400, { msg: "Date range is over 14 business days"});
  }

  res.locals.dateRange = { startDate, endDate };
  next();
}