import { IRestaurant, Restaurant } from "./types";

const RESTAURANTS: IRestaurant[] = [
    {
        id: Restaurant.Safka,
        name: "Safka",
        schoolName: "Juhannuskukkulan koulutalo",
        url: "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli"
    },
    {
        id: Restaurant.Amistoteles,
        name: "Amistoteles",
        schoolName: "Lemminkäisenkadun koulutalo",
        url: "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-lemminkaisenkatu-vip"
    },
];

export default RESTAURANTS;