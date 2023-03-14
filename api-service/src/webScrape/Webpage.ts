import parse, { HTMLElement } from "node-html-parser";
import assert from "node:assert";
import crypto from "crypto";
import { ElementUndefinedError } from "../errors";
import { DayMenu, DietaryRestrictions, Meal, WeekMenu } from "../types";
import { addDaysToDate, getDateOfISOWeek, IndexRange, isValidDateString, splitByIndexRange } from "../utils";

export default class Webpage {
  readonly url;
  readonly pageHTML;
  readonly page: HTMLElement;
  constructor(url: string, pageHTML: string) {
    this.url = url;
    this.pageHTML = pageHTML;
    this.page = parse(pageHTML);
  }

  /**
     * 
     * @throws { ElementUndefinedError } if any of the elements are not found.
     * @returns Scraped data from the page body
     */
  parse() {
    const dayContainers = this.page.querySelectorAll("tr");
    assert(dayContainers, new ElementUndefinedError("dayContainers"));
        

    const modifiedTime = this.getModifiedTime();
    const weekNum = this.getWeekNumber();

    const fullMenu: WeekMenu = { modifiedTime, weekNumber: weekNum, days: [] };

    // This might break when the year changes
    const mondayDate = getDateOfISOWeek(weekNum, new Date().getFullYear());
    mondayDate.setHours(0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = addDaysToDate(mondayDate, i);
      const dayHTML = dayContainers.at(i);

      const day: DayMenu = {
        hash: null,
        dayId: i,
        date,
        menu: []   
      };

      // if the html for the day is not found push the empty day to the array
      if (!dayHTML) {
        fullMenu.days.push(day);
        continue;
      }

      // If not get the foods
      const foodsHTML = dayHTML.getElementsByTagName("td").at(1);
      assert(foodsHTML, new ElementUndefinedError("foodsHTML"));

      const ogFoods: string[] = [];
      const processedFoods: Meal[] = [];

      foodsHTML.getElementsByTagName("p").forEach(element => {
        if (element.innerText.trim()) {
          ogFoods.push(element.innerText);
          processedFoods.push(this.mealFromUnparsedFoodName(element.innerText));
        }
      });
      // Add all the foods to the day object
      day.menu = processedFoods;
            
      let hash = null;
      if (ogFoods.length > 0) {
        ogFoods.push(date.toISOString());
        const hashable = ogFoods.join(".");
        hash = crypto.createHash("md5").update(hashable).digest("hex");
      }

      // Add the day to the week
      day.hash = hash;
      fullMenu.days.push(day);
    }
    return fullMenu;
  }


  getModifiedTime() {
    const meta = this.page.querySelector("head > meta[property=article:modified_time]");
    assert(meta, new ElementUndefinedError("meta"));
    
    const content = meta.getAttribute("content");
    assert(content, new Error("\"content\" attribute does not exist on \"meta\"."));
    
    assert(isValidDateString(content));
    
    return new Date(content);
  }

  getWeekNumber() {
    const meta = this.page.querySelector("head > meta[name=abstract]");
    assert(meta, new ElementUndefinedError("meta"));
    
    const content = meta.getAttribute("content");
    assert(content, new Error("\"content\" attribute does not exist on \"meta\"."));
    
    const matches = content.match(/ruokalista vko [0-9]{1,2}/i);
    assert(matches);
    
    const match = matches.at(0);
    assert(match);
    
    const num = match.split(" ").at(-1);
    assert(num);
    
    return parseInt(num);
  }

  /**
     * 
     * @param foodName Unparsed food name
     * @returns name and diets of the food
     */
  private mealFromUnparsedFoodName(foodName: string): Meal {
    const validDietLetters = ["L", "M", "G"];
    const dietLetterRegex = new RegExp(`[^${validDietLetters.join("")}]`, "g");
    const dietRegex = new RegExp(`[^a-zA-ZåäöÅÄÖ]+(${validDietLetters.join("|")})[^a-zåäö]+`, "g");
    const name = foodName + " ";
    
    const matches: IndexRange[] = [];
    const matchedDiets = [];
    let currentMatch;
    while (null != (currentMatch = dietRegex.exec(name))) {
      const originalText = currentMatch[0];
      // Remove the last character
      // Regex might match the starting of a new word that starts with a capital letter
      const dietLetters = originalText.substring(0, originalText.length - 1).replaceAll(dietLetterRegex, "");
      
      let matchLen = -1;
      for (const matchStr of currentMatch) {
        if (matchLen < matchStr.length) {
          matchLen = matchStr.length;
        }
      }

      const matchStart = currentMatch.index;
      const matchEnd = matchStart + matchLen - 1;
      matchedDiets.push(this.dietaryRestrictionsFromString(dietLetters));
      matches.push({ start: matchStart, end: matchEnd});
    }

    const names = splitByIndexRange(name, matches);

    const result = {
      names: names.map(name => this.formatFoodName(name)),
      diets: matchedDiets
    };
    return result;
  }

  private dietaryRestrictionsFromString(dietString: string): DietaryRestrictions {
    const result: DietaryRestrictions = {
      isLactoseFree: false,
      isDairyFree: false,
      isGlutenFree: false
    };

    for (const possibleDiet of dietString) {
      switch (possibleDiet) {
      case "L":
        result.isLactoseFree = true;
        break;
      case "M":
        result.isDairyFree = true;
        break;
      case "G":
        result.isGlutenFree = true;
        break;
      default:
        break;
      }
    }
    return result;
  }

  private formatFoodName(foodName: string): string {
    const notAllowedCharacters = /[^a-zA-ZåäöÅÄÖ/\- ]+/g;

    let result = foodName.replaceAll(notAllowedCharacters, "");

    // Capitalize the first letter
    result = result.charAt(0).toLocaleUpperCase() + result.substring(1);

    // Remove multiple spaces
    result = result.replaceAll(/  +/g, " ");
    // Remove leading & trailing spaces
    result = result.trim();

    return result;
  }
}