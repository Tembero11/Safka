import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import DietChip from "../components/DietChip";
import Week from "../components/Week";
import getWeekMenu, { WeekMenu } from "../utils/getWeekMenu";

const Home: NextPage<{ menu: WeekMenu | null }> = ({menu}) => {
  return (
    <>
      <Head>
        <title>Safka Online</title>
      </Head>
      <p id="short-desc">Juhannuskukkulan opiskelija- ja <br /> henkilöstöruokailun helposti luettava <br /> ruokalista netissä.</p>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80%", gap: 20}}>
        <Week menu={menu}/>
        <p id="letter-meanings">
          <span><DietChip>L</DietChip>&nbsp; Laktoositon</span>
          <span><DietChip>M</DietChip>&nbsp; Maidoton</span>
          <span><DietChip>G</DietChip>&nbsp; Gluteeniton</span>
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
