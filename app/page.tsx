import WeatherCard from "./components/WeatherCard";
import DeviceCard from "./components/DeviceCard";
import PullRequestsCard from "./components/PullRequestsCard";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
    <main>
      <DeviceCard />
      <WeatherCard location="Zendek" />
      <WeatherCard location="Šiauliai" />
      <WeatherCard location="Dukla" />
      <PullRequestsCard />
    </main>
    </>
  );
}
