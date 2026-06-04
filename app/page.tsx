import { fetchDashboardData, generateDashboardJSX } from '../lib/dashboard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await fetchDashboardData();
  return generateDashboardJSX(data);
}
