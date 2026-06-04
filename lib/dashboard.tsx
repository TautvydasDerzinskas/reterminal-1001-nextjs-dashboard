import { fetchDeviceData } from './device/services';
import { fetchWeatherData } from './weather/services';
import { fetchPendingReviewPRs } from './pullRequests/services';
import { DeviceData } from './device/types';
import { WeatherData } from './weather/types';
import { PullRequest } from './pullRequests/types';
import { theme } from './theme';
import { labels } from './labels';
import { DeviceSection } from './components/DeviceSection/index';
import { WeatherSection } from './components/WeatherSection/index';
import { PullRequestsSection } from './components/PullRequestsSection/index';

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

      <WeatherSection weatherData={weatherData} cities={cities} />

      <PullRequestsSection prs={prs} />
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