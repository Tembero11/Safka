import axios from "axios";
import ms from "ms";
import assert from "node:assert";
import { EventEmitter } from "node:events";
import { InvalidDateError } from "../errors";
import { IRestaurant, WeekMenu } from "../types";
import { isValidDateString } from "../utils";
import Webpage from "./Webpage";

interface PollerOptions {
    enableLogs?: boolean
}

declare interface MenuPoller {
    on(event: "polled", listener: (menu: WeekMenu) => void): this;
}

class MenuPoller extends EventEmitter {
  readonly restaurant: IRestaurant;
  isRunning = false;
  // 16 min in ms
  readonly defaultTime = 16 * 60 * 1000;
  // 3 min in ms
  readonly retryTime = 3 * 60 * 1000;

  enableLogs = true;

  /**
     * Contains the latest menu loaded.
     */
  latestMenu: WeekMenu | undefined;

  constructor(restaurant: IRestaurant, options?: PollerOptions) {
    super();
    if (options?.enableLogs === false) {
      this.enableLogs = false;
    }
    this.restaurant = restaurant;
  }

  startPolling() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.poll();
  }
  stopPolling() {
    this.isRunning = false;
  }

  private async poll() {
    // Check that the poller is running
    if (!this.isRunning) return;

    let pollResult;
    try {
      pollResult = await this.getWebpage();
    } catch (err) {
      if (this.enableLogs) {
        console.log(err);
        console.log("Page load failed. Retrying in " + ms(this.retryTime, { long: true }));
      }
      this.pollNextIn(this.retryTime);
      return;
    }

    const { document, lastPossiblyModified } = pollResult;

    const timeUntilNextPoll = this.getNextPollTime(lastPossiblyModified);

    if (this.enableLogs) {
      console.log("Page will be polled in " + ms(timeUntilNextPoll, { long: true }));
    }

    const webpage = new Webpage(this.restaurant.url, document);
        
    let menu;
    try {
      menu = webpage.parse();
    } catch (err) {
      if (this.enableLogs) {
        console.log(err);
        console.log("Page load failed. Retrying in " + ms(this.retryTime, { long: true }));
      }
      this.pollNextIn(this.retryTime);
      return;
    }

    this.latestMenu = { restaurantId: this.restaurant.id, ...menu };

    this.emit("polled", menu);
        
    this.pollNextIn(timeUntilNextPoll);
  }

  pollNextIn(timeUntilNextPoll: number) {
    setTimeout(() => this.poll.bind(this)(),  timeUntilNextPoll);
  }


  /**
     * Sends a GET request
     * @returns `last-modified` header converted to a date
     * @returns current page's HTML
     */
  async getWebpage() {
    const resp = await axios.get(this.restaurant.url);

    const lastModified = resp.headers["last-modified"];

    assert(typeof lastModified === "string", new InvalidDateError(lastModified));
    assert(isValidDateString(lastModified), new InvalidDateError(lastModified));

    return {
      /**
             * Page HTML as a string
             */
      document: resp.data as string,
      /**
             * The date when the webpage was last possibly modified
             */
      lastPossiblyModified: new Date(lastModified)
    };
  }

  /**
     * Calculates the next time until the page should be polled.
     * @param lastModified
     */
  getNextPollTime(lastModified: Date) {
    return this.defaultTime - (new Date().getTime() - lastModified.getTime());
  }

  /**
     * @throws {AssertionError} if there is no menu loaded.
     */
  getLatestMenu() {
    assert(this.latestMenu);
    return this.latestMenu;
  }
}

export default MenuPoller;