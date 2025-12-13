import { ImageResponse } from 'next/og';
import { fetchDashboardData, generateDashboardJSX, generateErrorJSX } from '../../../lib/dashboard';

export const runtime = 'edge';

export async function GET() {
  try {
    const data = await fetchDashboardData();
    const jsx = generateDashboardJSX(data);

    return new ImageResponse(jsx, {
      width: 800,
      height: 480,
    });
  } catch (error) {
    console.error(error);
    const jsx = generateErrorJSX();
    return new ImageResponse(jsx, {
      width: 800,
      height: 480,
    });
  }
}