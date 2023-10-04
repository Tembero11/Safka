import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Diet } from "../components/DayBox";
import Week from "../components/Week";
import getWeekMenu, { WeekMenu } from "../utils/getWeekMenu";
import RestaurantSwitch from "../components/RestaurantSwitch";

const Home: NextPage<{ menu: WeekMenu | null }> = ({menu}) => {
  return (
    <>
      <Head>
        <title>Safka Online</title>
      </Head>
      <p id="short-desc">Juhannuskukkulan opiskelija- ja <br /> henkilöstöruokailun helposti luettava <br /> ruokalista netissä.</p>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80%", gap: 20}}>
        <Week menu={menu}/>
        <RestaurantSwitch/>
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
  let menu;
  try {
    menu = await getWeekMenu();
  } catch (err) {
    menu = null;
  }
  
  return {
    props: {
      menu: menu
    },
  };
};

export default Home;
