import Image from "next/image";
import WeatherCard from "./components/WeatherCard";
import CalendarCard from "./components/CalendarCard";

export default function Home() {
  return (
    <>
    <main>
      <WeatherCard location="Zendek" />
      <WeatherCard location="Šiauliai" />
      <WeatherCard location="Dukla" />
      {/*<CalendarCard />*/}
      <div className="card">
        <h2>Alerts</h2>
        <div className="metric">0</div>
        <p>No issues detected</p>
      </div>
    </main>
    </>
  );
}
