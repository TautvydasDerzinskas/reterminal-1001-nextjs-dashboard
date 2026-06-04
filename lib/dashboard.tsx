import { fetchDeviceData } from './DeviceSection/services';
import { fetchWeatherData } from './WeatherSection/services';
import { fetchPendingReviewPRs } from './PullRequestsSection/services';
import { DeviceData } from './DeviceSection/types';
import { WeatherData } from './WeatherSection/types';
import { PullRequest } from './PullRequestsSection/types';
import { theme } from './shared/theme';
import { labels } from './shared/labels';
import { styles } from './shared/styles';
import { DeviceSection } from './DeviceSection/index';
import { EmptyBatteryView } from './EmptyBatteryView';
import { WeatherSectionWeatherCard } from './WeatherSection/WeatherSectionWeatherCard';
import { PullRequestsSection } from './PullRequestsSection/index';
import { TrashPickupSection } from './TrashPickupSection/index';
import { getNextTrashPickup } from './TrashPickupSection/utils';
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
  const hideBattery = overrides?.firmware !== undefined && overrides.firmware.toLowerCase().includes('xiao');
  const batteryDisplay = hideBattery ? undefined : (overrides?.battery ?? `${deviceData?.battery}`);
  const firmwareDisplay = overrides?.firmware ?? deviceData?.firmware_version;

  const batteryLevel = batteryDisplay !== undefined ? parseInt(batteryDisplay, 10) : NaN;
  if (!hideBattery && !isNaN(batteryLevel) && batteryLevel < 6) {
    return <EmptyBatteryView batteryDisplay={batteryDisplay!} />;
  }

  return (
    <div
      style={{
        width: theme.canvas.width,
        height: theme.canvas.height,
        backgroundColor: theme.colors.background,
        padding: theme.padding.canvas,
        ...styles.flexCol,
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
        <div style={{ ...styles.flexCol, flex: 2, gap: theme.gap.cards }}>
          <div style={{ display: 'flex', gap: theme.gap.cards }}>
            <WeatherSectionWeatherCard weather={weatherData[0]} location={cities[0]} />
            <WeatherSectionWeatherCard weather={weatherData[1]} location={cities[1]} />
          </div>
          <PullRequestsSection prs={prs} />
        </div>

        {/* Right 1/3 column: 3rd weather card + trash section */}
        <div style={{ ...styles.flexCol, flex: 1, gap: theme.gap.cards }}>
          {/* Row wrapper keeps WeatherCard's flex:1 acting on width, not height */}
          <div style={{ display: 'flex' }}>
            <WeatherSectionWeatherCard weather={weatherData[2]} location={cities[2]} />
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
        ...styles.flexCenter,
        fontSize: theme.fontSizes.xl,
        color: theme.colors.text,
      }}
    >
      {labels.dashboardImageFailed}
    </div>
  );
}