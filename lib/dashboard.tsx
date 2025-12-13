import { fetchDeviceData } from '../app/components/DeviceCard/services';
import { fetchWeatherData } from '../app/components/WeatherCard/services';
import { fetchPendingReviewPRs } from '../app/components/PullRequestsCard/services';
import { DeviceData } from '../app/components/DeviceCard/types';
import { WeatherData } from '../app/components/WeatherCard/types';
import { PullRequest } from '../app/components/PullRequestsCard/types';

export interface DashboardData {
  deviceData: DeviceData | null;
  weatherZendek: WeatherData | null;
  weatherSiauliai: WeatherData | null;
  weatherDukla: WeatherData | null;
  prs: PullRequest[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [deviceData, weatherZendek, weatherSiauliai, weatherDukla, prs] = await Promise.all([
    fetchDeviceData().catch(() => null),
    fetchWeatherData('Zendek').catch(() => null),
    fetchWeatherData('Šiauliai').catch(() => null),
    fetchWeatherData('Dukla').catch(() => null),
    fetchPendingReviewPRs(
      process.env.GITHUB_TOKEN!,
      process.env.GITHUB_USERNAME!,
      process.env.GITHUB_OWNER!,
      process.env.GITHUB_REPO!,
    ).catch(() => []),
  ]);

  return {
    deviceData,
    weatherZendek,
    weatherSiauliai,
    weatherDukla,
    prs,
  };
}

export function generateDashboardJSX(data: DashboardData) {
  const { deviceData, weatherZendek, weatherSiauliai, weatherDukla, prs } = data;

  return (
    <div
      style={{
        width: '800px',
        height: '480px',
        backgroundColor: '#ffffff',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Roboto, Arial',
        color: '#000000',
      }}
    >
      {/* Device Card */}
      <div
        style={{
          border: '1px solid #000000',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#000000',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 'bold',
        }}
      >
        {deviceData ? (
          <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '16px' }}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15ZM4.5 9.75a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75H4.5Z" clip-rule="evenodd"></path></svg>
              <span style={{ marginLeft: '5px' }}>{deviceData.battery}%</span>
            </div>
            <div style={{ display: 'flex' }}>Temperature: {deviceData.temperature}°C</div>
            <div style={{ display: 'flex' }}>Humidity: {deviceData.humidity}%</div>
            <div style={{ display: 'flex' }}>Firmware: {deviceData.firmware_version}</div>
          </div>
        ) : (
          <div style={{ fontSize: '14px', color: '#ef4444', display: 'flex' }}>Failed to load device data</div>
        )}
      </div>

      {/* Weather Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {[weatherZendek, weatherSiauliai, weatherDukla].map((weather, index) => {
          const locations = ['Zendek', 'Šiauliai', 'Dukla'];
          return (
            <div
              key={index}
              style={{
                flex: 1,
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{locations[index]}</h4>
              {weather ? (
                <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex' }}>Current: {weather.currentTemp}°C</div>
                  <div style={{ display: 'flex' }}>High: {weather.highTemp}°C / Low: {weather.lowTemp}°C</div>
                  <div style={{ display: 'flex' }}>Humidity: {weather.humidity}%</div>
                  <div style={{ display: 'flex' }}>{weather.description}</div>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: '#ef4444', display: 'flex' }}>Failed to load weather</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pull Requests Card */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {prs.length > 0 ? (
          <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column' }}>
            {prs.slice(0, 5).map((pr) => (
              <div key={pr.number} style={{ marginBottom: '4px', display: 'flex' }}>
                #{pr.number}: {pr.title}
              </div>
            ))}
            {prs.length > 5 && <div style={{ display: 'flex' }}>... and {prs.length - 5} more</div>}
          </div>
        ) : (
          <div style={{ fontSize: '14px', display: 'flex' }}>No pending reviews</div>
        )}
      </div>
    </div>
  );
}

export function generateErrorJSX() {
  return (
    <div
      style={{
        width: '800px',
        height: '480px',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Roboto, Arial',
        fontSize: '24px',
        color: '#ef4444',
      }}
    >
      Failed to generate dashboard image
    </div>
  );
}