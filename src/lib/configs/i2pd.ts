// i2pd configuration generator

export interface I2pdConfig {
  ipv4: boolean;
  ipv6: boolean;
  dataDir: string;
  httpEnabled: boolean;
  httpAddress: string;
  httpPort: number;
  socksEnabled: boolean;
  socksAddress: string;
  socksPort: number;
  httpProxyEnabled: boolean;
  httpProxyAddress: string;
  httpProxyPort: number;
  bandwidth: number;
  shareRatio: number;
  tunnels: I2pdTunnel[];
}

export interface I2pdTunnel {
  name: string;
  type: 'client' | 'server';
  address: string;
  port: number;
  destination?: string;
  host?: string;
  inPort?: number;
  keys?: string;
}

export const defaultI2pdConfig: I2pdConfig = {
  ipv4: true,
  ipv6: false,
  dataDir: '/var/lib/i2pd',
  httpEnabled: true,
  httpAddress: '127.0.0.1',
  httpPort: 7070,
  socksEnabled: true,
  socksAddress: '127.0.0.1',
  socksPort: 4447,
  httpProxyEnabled: true,
  httpProxyAddress: '127.0.0.1',
  httpProxyPort: 4444,
  bandwidth: 0,
  shareRatio: 100,
  tunnels: [],
};

export function generateI2pdConfig(config: I2pdConfig): string {
  const lines: string[] = [];

  lines.push(`## i2pd Configuration File`);
  lines.push(`## Сгенерировано: Dark/Deep Web Infrastructure Platform`);
  lines.push('');

  // Network
  lines.push(`[DEFAULT]`);
  lines.push(`ipv4 = ${config.ipv4}`);
  lines.push(`ipv6 = ${config.ipv6}`);
  lines.push(`datadir = ${config.dataDir}`);
  if (config.bandwidth > 0) {
    lines.push(`bandwidth = ${config.bandwidth}`);
  }
  lines.push(`share = ${config.shareRatio}`);
  lines.push('');

  // Web console
  lines.push(`[http]`);
  lines.push(`enabled = ${config.httpEnabled}`);
  lines.push(`address = ${config.httpAddress}`);
  lines.push(`port = ${config.httpPort}`);
  lines.push('');

  // SOCKS proxy
  lines.push(`[socksproxy]`);
  lines.push(`enabled = ${config.socksEnabled}`);
  lines.push(`address = ${config.socksAddress}`);
  lines.push(`port = ${config.socksPort}`);
  lines.push('');

  // HTTP proxy
  lines.push(`[httpproxy]`);
  lines.push(`enabled = ${config.httpProxyEnabled}`);
  lines.push(`address = ${config.httpProxyAddress}`);
  lines.push(`port = ${config.httpProxyPort}`);
  lines.push('');

  // Tunnels
  if (config.tunnels.length > 0) {
    lines.push(`## --- Туннели ---`);
    config.tunnels.forEach(tunnel => {
      lines.push('');
      if (tunnel.type === 'client') {
        lines.push(`[${tunnel.name}]`);
        lines.push(`type = client`);
        lines.push(`address = ${tunnel.address}`);
        lines.push(`port = ${tunnel.port}`);
        if (tunnel.destination) {
          lines.push(`destination = ${tunnel.destination}`);
        }
        if (tunnel.keys) {
          lines.push(`keys = ${tunnel.keys}`);
        }
      } else {
        lines.push(`[${tunnel.name}]`);
        lines.push(`type = server`);
        lines.push(`host = ${tunnel.host || '127.0.0.1'}`);
        lines.push(`port = ${tunnel.port}`);
        if (tunnel.inPort) {
          lines.push(`inport = ${tunnel.inPort}`);
        }
        if (tunnel.keys) {
          lines.push(`keys = ${tunnel.keys}`);
        }
      }
    });
  }

  return lines.join('\n');
}

// I2P install commands
export const i2pdInstallCommands = `# Установка i2pd на Ubuntu/Debian
sudo apt update
sudo apt install i2pd

# Или установка из PPA (актуальная версия)
sudo add-apt-repository ppa:purplei2p/i2pd
sudo apt update
sudo apt install i2pd

# Запуск i2pd
sudo systemctl start i2pd
sudo systemctl enable i2pd

# Проверка статуса
sudo systemctl status i2pd

# Веб-консоль управления
# Откройте в браузере: http://127.0.0.1:7070

# Настройка HTTP-прокси в браузере
# HTTP Proxy: 127.0.0.1:4444
# SOCKS5 Proxy: 127.0.0.1:4447

# Конфигурационный файл
sudo nano /etc/i2pd/i2pd.conf

# Туннели
sudo nano /etc/i2pd/tunnels.conf

# Логи
sudo journalctl -u i2pd -f`;

// Known I2P eepsites catalog
export const knownEepsites = [
  { name: 'I2P Forum', address: 'forum.i2p', description: 'Главный форум сети I2P' },
  { name: 'Postman', address: 'stats.i2p', description: 'Статистика и информация о сети I2P' },
  { name: 'Identiguy', address: 'identiguy.i2p', description: 'Поисковик eepsites' },
  { name: 'I2P Git', address: 'git.repo.i2p', description: 'Git-хостинг в I2P' },
  { name: 'Ugha', address: 'ugha.i2p', description: 'Каталог I2P-сайтов' },
  { name: 'Notbob', address: 'notbob.i2p', description: 'Каталог и поисковая система I2P' },
];
