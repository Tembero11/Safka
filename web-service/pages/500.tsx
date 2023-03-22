import ErrorPage from "../components/ErrorPage";

const InternalServerError = () => <ErrorPage code={500} header={"Sisäinen palvelin virhe"} explanation={""} />
export default InternalServerError;