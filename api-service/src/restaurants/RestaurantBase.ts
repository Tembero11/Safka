import { EventEmitter } from "stream";
import { Restaurant, RestaurantDay } from "../types/databaseFormat";

declare interface RestaurantBase {
    /**
     *  `change` event is fired when the menu changes 
     */
    // on(event: "change", listener: (restaurant: Restaurant) => void): this;

    /**
     *  `update` event is fired when the menu is reloaded 
     */
    on(event: "update", listener: (restaurant: Restaurant) => void): this;
}

abstract class RestaurantBase extends EventEmitter {
    readonly name;
    readonly url;
    readonly desc;
    readonly defaultLunchTime;


    isPolling = false;

    menus: RestaurantDay[] = [];

    constructor(info: Restaurant) {
        super();
        this.name = info.name;
        this.url = info.url;
        this.desc = info.desc;
        this.defaultLunchTime = info.defaultLunchTime;
    }

    getTimeUntilNextPoll(failed: boolean) {
        return failed ? 3 * 60 * 1000 : 16 * 60 * 1000;
    }

    startPolling() {
        this.pollCaller();
        this.isPolling = true;
    }
    stopPolling() {
        this.isPolling = false;
    }

    private async pollCaller() {
        if (!this.isPolling) return;
        try {
            const menus = await this.getMenus();
            this.emit("update", menus);

            setTimeout(this.pollCaller.bind(this), this.getTimeUntilNextPoll(false));
        } catch (err) {
            setTimeout(this.pollCaller.bind(this), this.getTimeUntilNextPoll(true));
            console.log(err);
        }
    }
    
    protected async getMenus(): Promise<Omit<RestaurantDay, "_id">[]> {
        throw new Error("Method should be extended!");
    }
}

export default RestaurantBase;