// Tor configuration API route
import { NextRequest, NextResponse } from 'next/server';
import { generateTorrc, generateTorSocksConfig, generateOnionServiceConfig, defaultTorRelayConfig, TorRelayConfig, TorSocksConfig, OnionServiceConfig } from '@/lib/configs/torrc';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, config } = body;

    switch (type) {
      case 'relay': {
        const relayConfig = { ...defaultTorRelayConfig, ...config } as TorRelayConfig;
        const torrc = generateTorrc(relayConfig);
        return NextResponse.json({ config: torrc });
      }
      case 'socks': {
        const socksConfig = config as TorSocksConfig;
        const torrc = generateTorSocksConfig(socksConfig);
        return NextResponse.json({ config: torrc });
      }
      case 'onion': {
        const onionConfig = config as OnionServiceConfig;
        const torrc = generateOnionServiceConfig(onionConfig);
        return NextResponse.json({ config: torrc });
      }
      default:
        return NextResponse.json({ error: 'Invalid config type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Tor API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
