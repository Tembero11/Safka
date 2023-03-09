import parse, { HTMLElement } from "node-html-parser";
import assert, { match } from "node:assert";
import crypto from "crypto";
import { ElementUndefinedError } from "../errors";
import { DayMenu, DietaryRestrictions, Food, WeekMenu } from "../types";
import { addDaysToDate, getDateOfISOWeek, isValidDateString } from "../utils";

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
      const processedFoods: Food[] = [];

      foodsHTML.getElementsByTagName("p").forEach(element => {
        if (element.innerText.trim()) {
          ogFoods.push(element.innerText);
          processedFoods.push(this.getDietsAndName(element.innerText));
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
  private getDietsAndName(foodName: string) {
    // The default state for diets
    const result = {
      isLactoseFree: false,
      isDairyFree: false,
      isGlutenFree: false,
    };

    // Change all empty characters into a space and remove spaces from the start and end of the string
    // Also fix typos with slash not having a space infront
    // This might in a rare condition where a diet character is infront of a slash fix the misinterpretation
    const name = foodName.replaceAll(/\s/g, " ").split("/").join(" / ").trim();

    // This regex finds any of the L, M, G characters that have a lower case nonalphabetic character after them
    const dietRegex = /(L|M|G)[^a-zåäö]/g;

    // Also add one space to the end of the string
    // A hacky way for the regex to handle the end of the string
    const matches = (name + " ").match(dietRegex);

    const notAllowedCharacters = /[^a-zA-ZåäöÅÄÖ/ ]{1,}/g;


    // Doesn't work (yet)
    if (foodName == "Falafelpyöryköitä (M, G), paholaisen kastiketta (M, G)") {
      const matches = [{text: "", index: -1}];
      let match;
      while (null != (match=dietRegex.exec(name + "  "))) {
        matches.push({text: match[0], index: match.index});
      }

      const dishes = {names: [], diets: []} as {names: string[], diets: DietaryRestrictions[]};
      for (let i = 0; i < matches.length; i++) {
        const match1 = matches[i];
        const match2 = matches.at(i + 1);
        if (match2) {
          const subStrStart = match1.index + 1;
          const subStrEnd = match2.index;

          const str = foodName.substring(subStrStart, subStrEnd).replaceAll(notAllowedCharacters, "").trim();

          if (str.length > 0) {
            const dishName = str.charAt(0).toLocaleUpperCase() + str.substring(1);
            dishes.names.push(dishName);
            dishes.diets.push({isLactoseFree: false, isGlutenFree: false, isDairyFree: false});
          }else {
            const lastDishIndex = dishes.names.length - 1;
            const diets = match1.text + match2.text;
            dishes.diets[lastDishIndex] = this.dietsFromString(diets);
          }
        }
      }
      console.log(dishes);
    }

    // Remove all characters that are considered not allowed
    let processedName = name
      .replaceAll(dietRegex, "")
      .replaceAll(notAllowedCharacters, "")
    // Replace multiple whitespaces with only one
      .replaceAll(/  +/g, " ").trim();

    // Capitalize the first letter
    processedName = processedName.charAt(0).toLocaleUpperCase() + processedName.substring(1);

    if (!matches) return {
      name: processedName,
      ...result
    };

    // String might contain other chars as well
    const dietString = matches.join("");

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

    return {
      name: processedName,
      ...result
    };
  }


  private dietsFromString(dietString: string) {
    // The default state for diets
    const result = {
      isLactoseFree: false,
      isDairyFree: false,
      isGlutenFree: false,
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
}