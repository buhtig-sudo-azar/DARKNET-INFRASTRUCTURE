// Tor configuration generators

export interface TorRelayConfig {
  nodeType: 'relay' | 'guard' | 'exit' | 'bridge';
  nickname: string;
  contactEmail: string;
  orPort: number;
  dirPort: number;
  bandwidthRate: string;
  bandwidthBurst: string;
  exitPolicy: 'default' | 'reduced' | 'custom';
  customExitPolicy?: string;
  enableIPv6: boolean;
  myFamily: string;
  logLevel: 'notice' | 'info' | 'debug';
  runAsDaemon: boolean;
  hardwareAccel: boolean;
  disableDebugger: boolean;
}

export const defaultTorRelayConfig: TorRelayConfig = {
  nodeType: 'relay',
  nickname: 'MyAwesomeRelay',
  contactEmail: 'admin@example.com',
  orPort: 9001,
  dirPort: 9030,
  bandwidthRate: '100 MBytes',
  bandwidthBurst: '200 MBytes',
  exitPolicy: 'default',
  enableIPv6: false,
  myFamily: '',
  logLevel: 'notice',
  runAsDaemon: true,
  hardwareAccel: true,
  disableDebugger: true,
};

export function generateTorrc(config: TorRelayConfig): string {
  const lines: string[] = [];

  lines.push(`## Tor Relay Configuration`);
  lines.push(`## Тип ноды: ${config.nodeType.charAt(0).toUpperCase() + config.nodeType.slice(1)}`);
  lines.push(`## Сгенерировано: Dark/Deep Web Infrastructure Platform`);
  lines.push('');

  // Basic settings
  lines.push(`## --- Основные настройки ---`);
  lines.push(`Nickname ${config.nickname}`);
  lines.push(`ContactInfo ${config.contactEmail}`);
  lines.push(`ORPort ${config.orPort}`);

  if (config.nodeType !== 'bridge') {
    lines.push(`DirPort ${config.dirPort}`);
  }

  if (config.enableIPv6) {
    lines.push(`ORPort [::]:${config.orPort}`);
    lines.push(`IPv6Exit 1`);
  }

  // Node type specific
  if (config.nodeType === 'exit') {
    lines.push('');
    lines.push(`## --- Exit Node настройки ---`);
    lines.push(`ExitRelay 1`);
    if (config.exitPolicy === 'reduced') {
      lines.push(`ExitPolicy reject *:25`);
      lines.push(`ExitPolicy reject *:119`);
      lines.push(`ExitPolicy reject *:135-139`);
      lines.push(`ExitPolicy reject *:445`);
      lines.push(`ExitPolicy reject *:465`);
      lines.push(`ExitPolicy reject *:563`);
      lines.push(`ExitPolicy reject *:587`);
      lines.push(`ExitPolicy reject *:1214`);
      lines.push(`ExitPolicy reject *:4661-4666`);
      lines.push(`ExitPolicy reject *:6346-6429`);
      lines.push(`ExitPolicy reject *:6697`);
      lines.push(`ExitPolicy reject *:6881-6999`);
      lines.push(`ExitPolicy accept *:*`);
    } else if (config.exitPolicy === 'custom' && config.customExitPolicy) {
      config.customExitPolicy.split('\n').forEach(line => {
        if (line.trim()) lines.push(`ExitPolicy ${line.trim()}`);
      });
    } else {
      lines.push(`ExitPolicy accept *:*`);
    }
  } else {
    lines.push(`ExitRelay 0`);
    lines.push(`ExitPolicy reject *:*`);
  }

  if (config.nodeType === 'bridge') {
    lines.push('');
    lines.push(`## --- Bridge настройки ---`);
    lines.push(`BridgeRelay 1`);
    lines.push(`ServerTransportPlugin obfs4 exec /usr/bin/obfs4proxy`);
    lines.push(`ServerTransportListenAddr obfs4 0.0.0.0:${config.orPort + 1}`);
    lines.push(`ExtORPort auto`);
    lines.push(`PublishServerDescriptor 0`);
  }

  // Bandwidth
  lines.push('');
  lines.push(`## --- Пропускная способность ---`);
  if (config.nodeType === 'exit') {
    lines.push(`RelayBandwidthRate ${config.bandwidthRate}`);
    lines.push(`RelayBandwidthBurst ${config.bandwidthBurst}`);
  } else {
    lines.push(`RelayBandwidthRate ${config.bandwidthRate}`);
    lines.push(`RelayBandwidthBurst ${config.bandwidthBurst}`);
  }

  // Logging
  lines.push('');
  lines.push(`## --- Логирование ---`);
  if (config.runAsDaemon) {
    lines.push(`Log ${config.logLevel} syslog`);
  } else {
    lines.push(`Log ${config.logLevel} stdout`);
  }

  // Security
  lines.push('');
  lines.push(`## --- Безопасность ---`);
  if (config.disableDebugger) {
    lines.push(`DisableDebuggerAttachment 1`);
  }
  if (config.hardwareAccel) {
    lines.push(`HardwareAccel 1`);
  }

  // Family
  if (config.myFamily) {
    lines.push('');
    lines.push(`## --- Семья нод ---`);
    lines.push(`MyFamily ${config.myFamily}`);
  }

  // Daemon
  if (config.runAsDaemon) {
    lines.push('');
    lines.push(`## --- Демон ---`);
    lines.push(`RunAsDaemon 1`);
  }

  // SOCKS5 proxy mode
  lines.push('');
  lines.push(`## --- SOCKS5 прокси (для клиентского режима) ---`);
  lines.push(`SocksPort 9050`);
  lines.push(`SocksPolicy accept 127.0.0.1`);
  lines.push(`SocksPolicy reject *`);

  return lines.join('\n');
}

export interface TorSocksConfig {
  socksPort: number;
  socksListenAddress: string;
  isolateDestPort: boolean;
  isolateDestAddr: boolean;
  safeSocks: boolean;
  testSocks: boolean;
}

export function generateTorSocksConfig(config: TorSocksConfig): string {
  const lines: string[] = [];
  lines.push(`## Tor SOCKS5 Proxy Configuration`);
  lines.push('');
  lines.push(`SocksPort ${config.socksListenAddress}:${config.socksPort}`);
  if (config.isolateDestPort) lines.push(`SocksPort ${config.socksListenAddress}:${config.socksPort} IsolateDestPort`);
  if (config.isolateDestAddr) lines.push(`SocksPort ${config.socksListenAddress}:${config.socksPort} IsolateDestAddr`);
  lines.push(`SocksPolicy accept 127.0.0.1`);
  lines.push(`SocksPolicy reject *`);
  if (config.safeSocks) lines.push(`SafeSocks 1`);
  if (config.testSocks) lines.push(`TestSocks 1`);
  lines.push(`SocksTimeout 120`);
  return lines.join('\n');
}

export interface OnionServiceConfig {
  serviceName: string;
  hiddenServiceDir: string;
  port: number;
  targetHost: string;
  targetPort: number;
  version: 3;
  clientAuth: boolean;
  authorizedClients: string[];
}

export function generateOnionServiceConfig(config: OnionServiceConfig): string {
  const lines: string[] = [];
  lines.push(`## Onion Service Configuration (v${config.version})`);
  lines.push(`## Сервис: ${config.serviceName}`);
  lines.push('');
  lines.push(`HiddenServiceDir ${config.hiddenServiceDir}`);
  lines.push(`HiddenServicePort ${config.port} ${config.targetHost}:${config.targetPort}`);
  lines.push(`HiddenServiceVersion ${config.version}`);

  if (config.clientAuth && config.authorizedClients.length > 0) {
    lines.push('');
    lines.push(`## Client Authorization`);
    lines.push(`## Добавьте файлы .auth в ${config.hiddenServiceDir}/authorized_clients/`);
    config.authorizedClients.forEach(client => {
      lines.push(`## Клиент: ${client} → файл: ${client}.auth`);
    });
  }

  return lines.join('\n');
}

// Tor relay config descriptions for UI
export const torrcOptionDescriptions: Record<string, string> = {
  Nickname: 'Имя вашего ретранслятора в сети Tor. Видно публично в консенсусе. Допустимы буквы, цифры и дефисы.',
  ContactInfo: 'Контактная информация оператора. Рекомендуется указать email для получения уведомлений о проблемах с узлом.',
  ORPort: 'Порт для входящих Tor-соединений. Должен быть открыт в файрволе. Стандартный: 9001.',
  DirPort: 'Порт для обслуживания каталога Tor. Нужен для Guard/Relay узлов. Стандартный: 9030.',
  ExitRelay: '1 = Exit-узел (разрешает исходящий трафик в интернет), 0 = Relay только (без выхода).',
  ExitPolicy: 'Политика выхода: какие порты и адреса разрешены для исходящего трафика.',
  RelayBandwidthRate: 'Средняя пропускная способность ретранслятора. Формат: N Bytes/KBytes/MBytes/GBytes.',
  RelayBandwidthBurst: 'Максимальная пропускная способность при пиковых нагрузках. Обычно в 2x больше Rate.',
  BridgeRelay: '1 = узел работает как мост (не публикуется в каталоге). Используется для обхода цензуры.',
  DisableDebuggerAttachment: '1 = запрещает отладчикам подключаться к процессу Tor. Повышает безопасность.',
  HardwareAccel: '1 = использовать аппаратное ускорение AES (AES-NI). Значительно повышает производительность.',
  MyFamily: 'Список идентификаторов узлов, принадлежащих одному оператору. Формат: $FINGERPRINT1,$FINGERPRINT2.',
  SocksPort: 'Порт для SOCKS5-прокси Tor. Через него приложения могут направлять трафик в сеть Tor.',
  SafeSocks: '1 = отклонять небезопасные SOCKS-запросы (с локальным DNS-резолвингом).',
  RunAsDaemon: '1 = запускать Tor как фоновый демон. 0 = запускать в foreground (для отладки).',
};
