import WeatherCard from "./components/WeatherCard";
import CalendarCard from "./components/CalendarCard";
import DeviceCard from "./components/DeviceCard";

export default function Home() {
  return (
    <>
    <main>
      <DeviceCard />
      <WeatherCard location="Zendek" />
      <WeatherCard location="Šiauliai" />
      <WeatherCard location="Dukla" />
      <div className="card">
        <h2>Alerts</h2>
        <div className="metric">0</div>
        <p>No issues detected</p>
      </div>
    </main>
    </>
  );
}
