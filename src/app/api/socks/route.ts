// SOCKS5 configuration API route
import { NextRequest, NextResponse } from 'next/server';
import { generateDanteConfig, defaultDanteConfig, DanteConfig } from '@/lib/configs/sockd';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, config } = body;

    switch (type) {
      case 'dante': {
        const danteConfig = { ...defaultDanteConfig, ...config } as DanteConfig;
        const sockd = generateDanteConfig(danteConfig);
        return NextResponse.json({ config: sockd });
      }
      default:
        return NextResponse.json({ error: 'Invalid config type' }, { status: 400 });
    }
  } catch (error) {
    console.error('SOCKS API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
