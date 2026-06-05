// I2P configuration API route
import { NextRequest, NextResponse } from 'next/server';
import { generateI2pdConfig, defaultI2pdConfig, I2pdConfig } from '@/lib/configs/i2pd';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, config } = body;

    switch (type) {
      case 'i2pd': {
        const i2pdConfig = { ...defaultI2pdConfig, ...config } as I2pdConfig;
        const conf = generateI2pdConfig(i2pdConfig);
        return NextResponse.json({ config: conf });
      }
      default:
        return NextResponse.json({ error: 'Invalid config type' }, { status: 400 });
    }
  } catch (error) {
    console.error('I2P API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
