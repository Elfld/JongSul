// app/api/health/route.ts
import { NextResponse } from 'next/server';

/**
 * 서버 상태 확인 API (Health Check)
 * 서버가 정상적으로 작동하는지 확인하는 엔드포인트
 * API_BASE_URL 정보도 함께 반환
 */
export async function GET() {
  const apiBaseUrl = process.env.API_BASE_URL;

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Server is running',
    apiBaseUrl: apiBaseUrl || null,
    isMockData: !apiBaseUrl,
  });
}
