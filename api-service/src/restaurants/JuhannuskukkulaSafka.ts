import { Restaurant, RestaurantDay } from "../types/databaseFormat";
import RestaurantBase from "./RestaurantBase";

class JuhannuskukkulaSafka extends RestaurantBase {
    constructor(info: Restaurant) {
        super(info);
    }

    protected getMenus(): Promise<Omit<RestaurantDay, "_id">[]> {
        
    }
}