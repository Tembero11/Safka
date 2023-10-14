import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Diet } from "../components/DayBox";
import Week from "../components/Week";
import getWeekMenu, { WeekMenu } from "../utils/getWeekMenu";
import RestaurantSwitch, { IRestaurant } from "../components/RestaurantSwitch";
import getRestaurants from "../utils/getRestaurants";
import { useState } from "react";

const Home: NextPage<{ menu: WeekMenu[], restaurants?: IRestaurant[] }> = ({menu, restaurants}) => {

  const [currentRestaurantId, setCurrentRestaurantId] = useState(0);

  return (
    <>
      <Head>
        <title>Safka Online</title>
      </Head>
      <p id="short-desc">Juhannuskukkulan opiskelija- ja <br /> henkilöstöruokailun helposti luettava <br /> ruokalista netissä.</p>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80%", gap: 20}}>
        {
          restaurants ? <RestaurantSwitch onChange={({id}) => setCurrentRestaurantId(id)} restaurants={restaurants}/> : <></>
        }
        <Week menu={menu[currentRestaurantId]}/>
        <p id="letter-meanings">
          <span><Diet>L</Diet>&nbsp; Laktoositon</span>
          <span><Diet>M</Diet>&nbsp; Maidoton</span>
          <span><Diet>G</Diet>&nbsp; Gluteeniton</span>
        </p>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let menu = [];
  let restaurants = null;

  try {
    restaurants = (await getRestaurants()).restaurants;
  } catch (err) {}

  if (restaurants) {
    try {
      menu.push(await getWeekMenu(restaurants[0].id));
    } catch (err) {}
  }
  
  return {
    props: {
      menu,
      restaurants,
    },
  };
};

export default Home;
