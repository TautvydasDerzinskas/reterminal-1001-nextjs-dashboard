import WeatherCard from "./components/WeatherCard";
import DeviceCard from "./components/DeviceCard";
import PullRequestsCard from "./components/PullRequestsCard";

export const dynamic = 'force-dynamic';

export default function Home() {
  const cities = process.env.NEXT_PUBLIC_WEATHER_CITIES?.split(',') as string[];

  return (
    <>
    <main>
      <DeviceCard />
      {cities.map(city => (
        <WeatherCard key={city.trim()} location={city.trim()} />
      ))}
      <PullRequestsCard />
    </main>
    </>
  );
}
