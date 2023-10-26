import cors from "cors";
import { Router } from "express";
import { apiResponse } from "./apiResponse";
import restaurants from "../restaurants";
import { validateDateRange, validateRestaurantId } from "./middlewares/validation";
import { v3MenusController } from "./controllers/v3MenusController";

const api = Router();
api.use(cors());

api.get("/v3/restaurants", async (req, res) => {
  return apiResponse(res, 200, { restaurants });
});

api.get("/v3/menu/:restaurantId", validateRestaurantId, v3MenusController.getRestaurantMenus);
api.get("/v3/menu/:restaurantId/today", validateRestaurantId, v3MenusController.getTodayMenu);
api.get("/v3/menu/:restaurantId/between", validateRestaurantId, validateDateRange, v3MenusController.getMenusBetweenDates);
api.get("/v3/menu/:restaurantId/:dayId", validateRestaurantId, v3MenusController.getMenuByDayId);


export default api;
