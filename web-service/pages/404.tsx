import ErrorPage from "../components/ErrorPage";

const NotFoundPage = () => <ErrorPage code={404} header={"Sivua ei löydy"} explanation={"Emme valitettavasti löytäneet etsimääsi sivua."} showHomeButton />
export default NotFoundPage;