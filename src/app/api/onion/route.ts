// Onion Service configuration API route
import { NextRequest, NextResponse } from 'next/server';
import { generateNginxOnionConfig, defaultNginxOnionConfig, NginxOnionConfig } from '@/lib/configs/nginx-onion';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, config } = body;

    switch (type) {
      case 'nginx': {
        const nginxConfig = { ...defaultNginxOnionConfig, ...config } as NginxOnionConfig;
        const conf = generateNginxOnionConfig(nginxConfig);
        return NextResponse.json({ config: conf });
      }
      default:
        return NextResponse.json({ error: 'Invalid config type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Onion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
