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

const getTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Warsaw',
  });

export async function fetchDashboardData(): Promise<DashboardData> {
  const [deviceData, weatherZendek, weatherSiauliai, weatherDukla, prs] = await Promise.all([
    fetchDeviceData().catch(() => null),
    fetchWeatherData('Zendek').catch(() => null),
    fetchWeatherData('Šiauliai').catch(() => null),
    fetchWeatherData('Dukla').catch(() => null),
    fetchPendingReviewPRs(
      process.env.NEXT_PUBLIC_GITHUB_TOKEN!,
      process.env.NEXT_PUBLIC_GITHUB_USERNAME!,
      process.env.NEXT_PUBLIC_GITHUB_OWNER!,
      process.env.NEXT_PUBLIC_GITHUB_REPO!,
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
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '16px', marginRight: '5px' }}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15ZM4.5 9.75a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75H4.5Z" clip-rule="evenodd"></path></svg>
              <span style={{ marginLeft: '5px' }}>{deviceData.battery}%</span>
            </div>
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '16px', marginRight: '5px' }}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd"></path></svg>
              <span style={{ marginLeft: '5px' }}>{getTime()}</span>
            </div>
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '16px', marginRight: '5px' }}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M100.59 334.24c48.57 3.31 58.95 2.11 58.95 11.94 0 20-65.55 20.06-65.55 1.52.01-5.09 3.29-9.4 6.6-13.46zm27.95-116.64c-32.29 0-33.75 44.47-.75 44.47 32.51 0 31.71-44.47.75-44.47zM448 80v352a48 48 0 0 1-48 48H48a48 48 0 0 1-48-48V80a48 48 0 0 1 48-48h352a48 48 0 0 1 48 48zm-227 69.31c0 14.49 8.38 22.88 22.86 22.88 14.74 0 23.13-8.39 23.13-22.88S258.62 127 243.88 127c-14.48 0-22.88 7.84-22.88 22.31zM199.18 195h-49.55c-25-6.55-81.56-4.85-81.56 46.75 0 18.8 9.4 32 21.85 38.11C74.23 294.23 66.8 301 66.8 310.6c0 6.87 2.79 13.22 11.18 16.76-8.9 8.4-14 14.48-14 25.92C64 373.35 81.53 385 127.52 385c44.22 0 69.87-16.51 69.87-45.73 0-36.67-28.23-35.32-94.77-39.38l8.38-13.43c17 4.74 74.19 6.23 74.19-42.43 0-11.69-4.83-19.82-9.4-25.67l23.38-1.78zm84.34 109.84l-13-1.78c-3.82-.51-4.07-1-4.07-5.09V192.52h-52.6l-2.79 20.57c15.75 5.55 17 4.86 17 10.17V298c0 5.62-.31 4.58-17 6.87v20.06h72.42zM384 315l-6.87-22.37c-40.93 15.37-37.85-12.41-37.85-16.73v-60.72h37.85v-25.41h-35.82c-2.87 0-2 2.52-2-38.63h-24.18c-2.79 27.7-11.68 38.88-34 41.42v22.62c20.47 0 19.82-.85 19.82 2.54v66.57c0 28.72 11.43 40.91 41.67 40.91 14.45 0 30.45-4.83 41.38-10.2z"></path></svg>
              <span style={{ marginLeft: '5px' }}>{deviceData.firmware_version}</span>
            </div>
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '16px', marginRight: '5px' }}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M416 0c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm-160-16C256 50.1 205.9 0 144 0S32 50.1 32 112v166.5C12.3 303.2 0 334 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-34-12.3-64.9-32-89.5V112zM144 448c-44.1 0-80-35.9-80-80 0-25.5 12.2-48.9 32-63.8V112c0-26.5 21.5-48 48-48s48 21.5 48 48v192.2c19.8 14.8 32 38.3 32 63.8 0 44.1-35.9 80-80 80zm16-125.1V112c0-8.8-7.2-16-16-16s-16 7.2-16 16v210.9c-18.6 6.6-32 24.2-32 45.1 0 26.5 21.5 48 48 48s48-21.5 48-48c0-20.9-13.4-38.5-32-45.1z"></path></svg>
              <span style={{ marginLeft: '5px' }}>{deviceData.temperature}</span>
            </div>
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '16px', marginRight: '5px' }}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"></path></svg>
              <span style={{ marginLeft: '5px' }}>{deviceData.humidity}</span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '14px', color: '#FFFFFF', display: 'flex' }}>Failed to load device data</div>
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
                border: '1px solid #000000',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                color: '#000000',
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
                <div style={{ fontSize: '14px', color: '#000000', display: 'flex' }}>Failed to load weather</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pull Requests Card */}
      <div
        style={{
          border: '1px solid #000000',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#FFFFFF',
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
        color: '#000000',
      }}
    >
      Failed to generate dashboard image
    </div>
  );
}