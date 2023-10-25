import { Request, Response } from "express";
import { z } from "zod";
import restaurants from "../../restaurants";
import { apiResponse } from "../apiResponse";
import { NextFunction } from "express";

const restaurantIdSchema = z.number().min(0).max(restaurants.length);

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