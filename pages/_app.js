import NavBar from "../components/layout/NavBar";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <main className="flex max-h-screen">
      <NavBar />
      <Component {...pageProps} />
    </main>
  );
}
