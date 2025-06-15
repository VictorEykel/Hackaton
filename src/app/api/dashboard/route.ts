// /src/app/api/dashboard/route.ts

import { NextRequest } from 'next/server';
import { handleDashboardGet /*, handleDashboardPost */ } from './dashboardHandler';

export async function GET(request: NextRequest) {
    return await handleDashboardGet(request);
}

// Exemplo para POST, caso futuramente queira implementar
// export async function POST(request: NextRequest) {
//   return await handleDashboardPost(request);
// }
