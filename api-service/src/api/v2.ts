import cors from "cors";
import { Router } from "express";
import { v2MenusController } from "./controllers/v2MenusController";

const api = Router();
api.use(cors());

api.get("/v2/menu", v2MenusController.getMenus);

api.get("/v2/menu/today", v2MenusController.getMenusForToday);

api.get("/v2/menu/:dayId", v2MenusController.getMenusForDayId);

export default api;
