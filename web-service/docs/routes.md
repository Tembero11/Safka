### /v2/menu
This endpoint returns the menu for the week. The response is a JSON object with the following fields:

- hash (string): A unique identifier for the menu used for database storage.
- days (array): An array containing the menus for each day of the week. Each item in the array is an object with the following fields:
  - dayId (integer): The numerical identifier of the day (0-6 where 0 is monday)
  - date (string): The date of the menu in ISO 8601 format
  - menu (array): An array containing the menu items for the day. Each item is an object with the following fields:
    - names (array): An array of strings representing the names of the menu items.
    - diets (array): An array of objects representing the dietary information of the menu items. Each object has the following fields:
      - isLactoseFree (boolean): Whether the item is lactose-free or not.
      - isDairyFree (boolean): Whether the item is dairy-free or not.
      - isGlutenFree (boolean): Whether the item is gluten-free or not.

### /v2/menu/today
This endpoint returns the menu for the current day. The response is a JSON object with the same format as the /v2/menu endpoint.

#### Example Response:
```json
{
  "hash": "21247393ffc9bd7274c10261c64792e3",
  "days": [
    {
      "dayId": 2,
      "date": "2023-04-05T00:00:00.000Z",
      "menu": [
        {
          "names": [
            "Rapeita kalapyöryköitä"
          ],
          "diets": [
            {
              "isLactoseFree": false,
              "isDairyFree": false,
              "isGlutenFree": true
            }
          ]
        },
        {
          "names": [
            "Kasvispyöryköitä"
          ],
          "diets": [
            {
              "isLactoseFree": false,
              "isDairyFree": true,
              "isGlutenFree": true
            }
          ]
        },
        {
        "names": [
            "Tartarkastiketta"
          ],
          "diets": [
            {
              "isLactoseFree": true,
              "isDairyFree": false,
              "isGlutenFree": false
            }
          ]
        }
      ],
      "httpCode": 200,
      "msg": "OK",
      "ok": true
    }
  ]
}
```

### /v2/menu/{dayId}
This endpoint returns the menu for a specific day of the week. The `dayId` parameter must be an integer between 0 and 6 (inclusive) representing the day of the week, starting from **monday**. The response is a JSON object with the same format as the `/v2/menu` endpoint.

#### Example Request:

/v2/menu/2
#### Example Response:
```json
{
  "hash": "21247393ffc9bd7274c10261c64792e3",
  "days": [
    {
      "dayId": 2,
      "date": "2023-04-05T00:00:00.000Z",
      "menu": [
        {
          "names": [
            "Rapeita kalapyöryköitä"
          ],
          "diets": [
            {
              "isLactoseFree": false,
              "isDairyFree": false,
              "isGlutenFree": true
            }
          ]
        },
        {
          "names": [
            "Kasvispyöryköitä"
          ],
          "diets": [
            {
              "isLactoseFree": false,
              "isDairyFree": true,
              "isGlutenFree": true
            }
          ]
        },
        {
          "names": [
            "Tartarkastiketta"
          ],
          "diets": [
            {
              "isLactoseFree": true,
              "isDairyFree": false,
              "isGlutenFree": false
            }
          ]
        }
      ],
      "httpCode": 200,
      "msg": "OK",
      "ok": true
    }
  ]
}
```
