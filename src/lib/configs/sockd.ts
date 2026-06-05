// Dante SOCKS5 configuration generator

export interface DanteConfig {
  internalAddress: string;
  internalPort: number;
  externalInterface: string;
  authMethod: 'none' | 'username' | 'pam';
  logOutput: string;
  privilegedUser: string;
  unprivilegedUser: string;
  allowedClients: string;
  allowedDestinations: string;
  enableUDP: boolean;
}

export const defaultDanteConfig: DanteConfig = {
  internalAddress: '0.0.0.0',
  internalPort: 1080,
  externalInterface: 'eth0',
  authMethod: 'username',
  logOutput: '/var/log/sockd.log',
  privilegedUser: 'proxy',
  unprivilegedUser: 'nobody',
  allowedClients: '0.0.0.0/0',
  allowedDestinations: '0.0.0.0/0',
  enableUDP: false,
};

export function generateDanteConfig(config: DanteConfig): string {
  const lines: string[] = [];

  lines.push(`## Dante SOCKS5 Server Configuration`);
  lines.push(`## Сгенерировано: Dark/Deep Web Infrastructure Platform`);
  lines.push('');

  // Logging
  lines.push(`## --- Логирование ---`);
  lines.push(`logoutput: ${config.logOutput}`);
  lines.push('');

  // Internal interface
  lines.push(`## --- Внутренний интерфейс (слушающий) ---`);
  lines.push(`internal: ${config.internalAddress} port = ${config.internalPort}`);
  lines.push('');

  // External interface
  lines.push(`## --- Внешний интерфейс (исходящий) ---`);
  lines.push(`external: ${config.externalInterface}`);
  lines.push('');

  // Authentication
  lines.push(`## --- Аутентификация ---`);
  if (config.authMethod === 'none') {
    lines.push(`method: none`);
  } else if (config.authMethod === 'username') {
    lines.push(`method: username`);
  } else {
    lines.push(`method: pam`);
  }
  lines.push('');

  // Users
  lines.push(`## --- Системные пользователи ---`);
  lines.push(`user.privileged: ${config.privilegedUser}`);
  lines.push(`user.unprivileged: ${config.unprivilegedUser}`);
  lines.push('');

  // Client rules
  lines.push(`## --- Правила для клиентов ---`);
  lines.push(`client pass {`);
  lines.push(`  from: ${config.allowedClients} to: 0.0.0.0/0`);
  lines.push(`  log: error`);
  if (config.authMethod === 'username') {
    lines.push(`  method: username`);
  }
  lines.push(`}`);
  lines.push('');

  lines.push(`client block {`);
  lines.push(`  from: 0.0.0.0/0 to: 0.0.0.0/0`);
  lines.push(`  log: connect error`);
  lines.push(`}`);
  lines.push('');

  // Server rules
  lines.push(`## --- Правила для соединений ---`);
  const commands = config.enableUDP
    ? 'bind connect udpassociate'
    : 'bind connect';

  lines.push(`pass {`);
  lines.push(`  from: ${config.allowedClients} to: ${config.allowedDestinations}`);
  lines.push(`  command: ${commands}`);
  lines.push(`  log: error`);
  if (config.authMethod === 'username') {
    lines.push(`  method: username`);
  }
  lines.push(`}`);
  lines.push('');

  lines.push(`block {`);
  lines.push(`  from: 0.0.0.0/0 to: 0.0.0.0/0`);
  lines.push(`  log: connect error`);
  lines.push(`}`);

  return lines.join('\n');
}

// Dante install commands
export const danteInstallCommands = `# Установка Dante на Ubuntu/Debian
sudo apt update
sudo apt install dante-server

# Создание пользователя для SOCKS5
sudo useradd -r -s /bin/false sockd_user
sudo echo "sockd_user:YourSecurePassword" | sudo chpasswd

# Создание конфигурационного файла
sudo nano /etc/dante/sockd.conf

# Создание лог-файла
sudo touch /var/log/sockd.log
sudo chown proxy:nogroup /var/log/sockd.log

# Запуск Dante
sudo systemctl start danted
sudo systemctl enable danted

# Проверка статуса
sudo systemctl status danted

# Тестирование SOCKS5-прокси
curl --socks5 sockd_user:YourSecurePassword@127.0.0.1:1080 https://api.ipify.org
curl --socks5-hostname sockd_user:YourSecurePassword@127.0.0.1:1080 https://check.torproject.org`;

// Firefox SOCKS5 config
export const firefoxSocksConfig = `# Firefox about:config настройки для SOCKS5 через Tor
network.proxy.socks = 127.0.0.1
network.proxy.socks_port = 9050
network.proxy.socks_version = 5
network.proxy.socks_remote_dns = true
network.proxy.type = 1

# Отключение WebRTC (предотвращение утечки IP)
media.peerconnection.enabled = false

# Отключение DNS-префетча
network.dns.disablePrefetch = true
network.dns.disablePrefetchFromHTTPS = true

# Отключение отправки данных о производительности
datareporting.healthreport.uploadEnabled = false`;

// Privoxy config for Tor
export const privoxyConfig = `# Privoxy Configuration для работы с Tor
# Файл: /etc/privoxy/config

# Адрес и порт Privoxy
listen-address  127.0.0.1:8118

# Перенаправление всего трафика через Tor SOCKS5h
forward-socks5h   /               127.0.0.1:9050 .

# Включение фильтрации
toggle  1
enable-remote-toggle  0
enable-remote-http-toggle  0

# Логирование
logfile /var/log/privoxy/logfile
debug 1  # show each connection status
debug 4096 # Startup banner and warnings

# Конфиденциальность
filter-defaults-temp-fallback-block 0`;
