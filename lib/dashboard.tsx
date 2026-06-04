import { fetchDeviceData } from './device/services';
import { fetchWeatherData } from './weather/services';
import { fetchPendingReviewPRs } from './pullRequests/services';
import { DeviceData } from './device/types';
import { WeatherData } from './weather/types';
import { PullRequest } from './pullRequests/types';
import { theme } from './theme';
import { labels } from './labels';
import { DeviceSection } from './components/DeviceSection/index';
import { WeatherCard } from './components/WeatherSection/WeatherCard';
import { PullRequestsSection } from './components/PullRequestsSection/index';
import { TrashPickupSection } from './components/TrashPickupSection/index';
import { getNextTrashPickup } from './trashPickup/utils';
import trashPickupDates from '../data/trash-pickup-dates.json';

export interface DashboardData {
  deviceData: DeviceData | null;
  weatherData: WeatherData[];
  cities: string[];
  prs: PullRequest[];
}

export interface DashboardOverrides {
  battery?: string;
  firmware?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentTime(): string {
  return new Date().toLocaleTimeString(labels.timeLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: labels.timeZone,
  });
}

function getOverridesFromRequest(request?: Request): DashboardOverrides {
  if (!request) return {};
  const { searchParams } = new URL(request.url);
  const battery = searchParams.get('battery');
  const firmware = searchParams.get('firmware');
  return {
    battery: battery !== null ? battery : undefined,
    firmware: firmware !== null ? firmware : undefined,
  };
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export async function fetchDashboardData(): Promise<DashboardData> {
  const cities = process.env.NEXT_PUBLIC_WEATHER_CITIES?.split(',') || ['Zendek', 'Šiauliai', 'Dukla'];
  const weatherPromises = cities.map(city => fetchWeatherData(city.trim()).catch(() => null));
  const [deviceData, ...weatherDataAndPrs] = await Promise.all([
    fetchDeviceData().catch(() => null),
    ...weatherPromises,
    fetchPendingReviewPRs(
      process.env.NEXT_PUBLIC_GITHUB_TOKEN!,
      process.env.NEXT_PUBLIC_GITHUB_USERNAME!,
      process.env.NEXT_PUBLIC_GITHUB_OWNER!,
      process.env.NEXT_PUBLIC_GITHUB_REPO!,
    ).catch(() => []),
  ]);

  const prs = weatherDataAndPrs.pop() as PullRequest[];
  const weatherData = weatherDataAndPrs as WeatherData[];

  return { deviceData, weatherData, cities, prs };
}

// ─── JSX generators ───────────────────────────────────────────────────────────

export function generateDashboardJSX(data: DashboardData, request?: Request) {
  const { deviceData, weatherData, cities, prs } = data;
  const nextPickup = getNextTrashPickup(trashPickupDates as Parameters<typeof getNextTrashPickup>[0]);
  const overrides = getOverridesFromRequest(request);
  const batteryDisplay = overrides?.battery ?? `${deviceData?.battery}`;
  const firmwareDisplay = overrides?.firmware ?? deviceData?.firmware_version;

  return (
    <div
      style={{
        width: theme.canvas.width,
        height: theme.canvas.height,
        backgroundColor: theme.colors.background,
        padding: theme.padding.canvas,
        display: 'flex',
        flexDirection: 'column',
        color: theme.colors.text,
      }}
    >
      <DeviceSection
        deviceData={deviceData}
        batteryDisplay={batteryDisplay}
        firmwareDisplay={firmwareDisplay}
        currentTime={getCurrentTime()}
      />

      <div
        style={{
          display: 'flex',
          gap: theme.gap.cards,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left 2/3 column: first 2 weather cards + PR section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 2, gap: theme.gap.cards }}>
          <div style={{ display: 'flex', gap: theme.gap.cards }}>
            <WeatherCard weather={weatherData[0]} location={cities[0]} />
            <WeatherCard weather={weatherData[1]} location={cities[1]} />
          </div>
          <PullRequestsSection prs={prs} />
        </div>

        {/* Right 1/3 column: 3rd weather card + trash section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: theme.gap.cards }}>
          {/* Row wrapper keeps WeatherCard's flex:1 acting on width, not height */}
          <div style={{ display: 'flex' }}>
            <WeatherCard weather={weatherData[2]} location={cities[2]} />
          </div>
          <TrashPickupSection nextPickup={nextPickup} />
        </div>
      </div>
    </div>
  );
}

export function generateErrorJSX() {
  return (
    <div
      style={{
        width: theme.canvas.width,
        height: theme.canvas.height,
        backgroundColor: theme.colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: theme.fontSizes.xl,
        color: theme.colors.text,
      }}
    >
      {labels.dashboardImageFailed}
    </div>
  );
}