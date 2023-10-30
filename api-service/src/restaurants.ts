import { IRestaurant, Restaurant } from "./types";

const RESTAURANTS: IRestaurant[] = [
  {
    id: Restaurant.Safka,
    name: "Safka",
    desc: "Juhannuskukkulan opiskelija- ja\n henkilöstöruokailun helposti luettava\nruokalista netissä.",
    schoolName: "Juhannuskukkulan koulutalo",
    url: "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli"
  },
  {
    id: Restaurant.Amistoteles,
    name: "Amistoteles",
    desc: "Amistoteles-lounasravintolan\nhelposti luettava\nruokalista netissä.",
    schoolName: "Lemminkäisenkadun koulutalo",
    url: "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-lemminkaisenkatu-vip"
  },
];

export default RESTAURANTS;

