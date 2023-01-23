import assert from "assert";
import axios from "axios";
import { InvalidDateError } from "../errors";
import { Restaurant, RestaurantDay } from "../types/databaseFormat";
import { isValidDateString } from "../utils";
import Webpage from "../webScrape/Webpage";
import RestaurantBase from "./RestaurantBase";

const TAI_SAFKA_URL = "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli";

class JuhannuskukkulaSafka extends RestaurantBase {
    constructor(info: Restaurant) {
        super(info);
    }

    protected async getMenus(): Promise<Omit<RestaurantDay, "_id">[]> {
        let menuResult = await this.getWebpage();
        const { document, lastPossiblyModified } = pollResult;

        const timeUntilNextPoll = this.getNextPollTime(lastPossiblyModified);

        const webpage = new Webpage(TAI_SAFKA_URL, document);
        
        let menu = webpage.parse();
    }


    /**
     * Sends a GET request
     * @returns `last-modified` header converted to a date
     * @returns current page's HTML
     */
    private async getWebpage() {
        const resp = await axios.get(TAI_SAFKA_URL);

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
}