import { NextPage } from "next";
import Head from "next/head";
import { Diet } from "../components/DayBox";
import Week from "../components/Week";
import getWeekMenu, { WeekMenu } from "../utils/getWeekMenu";

const Home: NextPage<{ menu: WeekMenu | null }> = ({menu}) => {
  return (
      <>
        <Head>
          <title>Safka Online</title>
        </Head>
        <p id="shortDesc">Juhannuskukkulan opiskelija- ja <br /> henkilöstöruokailun helposti luettava <br /> ruokalista netissä.</p>
        <div className={"content"}>
          <Week menu={menu}/>
        </div>
        <p id="letterMeanings">
          <span><Diet>L</Diet>&nbsp; Laktoositon</span>
          <span><Diet>M</Diet>&nbsp; Maidoton</span>
          <span><Diet>G</Diet>&nbsp; Gluteeniton</span>
        </p>
      </>
  );
}


Home.getInitialProps = async () => {
  try {
    const menu = await getWeekMenu();
    return { menu }
  } catch (err) {
    return { menu: null }
  }
}

export default Home;