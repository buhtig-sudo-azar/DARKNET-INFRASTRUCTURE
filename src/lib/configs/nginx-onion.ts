// Nginx configuration generator for Onion Services

export interface NginxOnionConfig {
  onionAddress: string;
  listenPort: number;
  serverName: string;
  documentRoot: string;
  enableSSL: boolean;
  sslCertPath: string;
  sslKeyPath: string;
  enableSecurityHeaders: boolean;
  enableRateLimit: boolean;
  maxBodySize: string;
  upstreamServers: string[];
}

export const defaultNginxOnionConfig: NginxOnionConfig = {
  onionAddress: 'your-onion-address.onion',
  listenPort: 80,
  serverName: 'localhost',
  documentRoot: '/var/www/onion-site',
  enableSSL: false,
  sslCertPath: '/etc/ssl/certs/onion.crt',
  sslKeyPath: '/etc/ssl/private/onion.key',
  enableSecurityHeaders: true,
  enableRateLimit: false,
  maxBodySize: '10M',
  upstreamServers: [],
};

export function generateNginxOnionConfig(config: NginxOnionConfig): string {
  const lines: string[] = [];

  lines.push(`## Nginx Configuration for Onion Service`);
  lines.push(`## Onion Address: ${config.onionAddress}`);
  lines.push(`## Сгенерировано: Dark/Deep Web Infrastructure Platform`);
  lines.push('');

  // Upstream
  if (config.upstreamServers.length > 0) {
    lines.push(`upstream onion_backend {`);
    config.upstreamServers.forEach(server => {
      lines.push(`    server ${server};`);
    });
    lines.push(`}`);
    lines.push('');
  }

  // Server block
  lines.push(`server {`);
  lines.push(`    listen ${config.listenPort};`);
  if (config.enableSSL) {
    lines.push(`    listen 443 ssl;`);
  }
  lines.push(`    server_name ${config.serverName} ${config.onionAddress};`);
  lines.push('');

  // SSL
  if (config.enableSSL) {
    lines.push(`    ## SSL Configuration`);
    lines.push(`    ssl_certificate ${config.sslCertPath};`);
    lines.push(`    ssl_certificate_key ${config.sslKeyPath};`);
    lines.push(`    ssl_protocols TLSv1.2 TLSv1.3;`);
    lines.push(`    ssl_ciphers HIGH:!aNULL:!MD5;`);
    lines.push(`    ssl_prefer_server_ciphers on;`);
    lines.push('');
  }

  // Document root
  lines.push(`    root ${config.documentRoot};`);
  lines.push(`    index index.html index.htm;`);
  lines.push('');

  // Security headers
  if (config.enableSecurityHeaders) {
    lines.push(`    ## Security Headers`);
    lines.push(`    add_header X-Content-Type-Options nosniff;`);
    lines.push(`    add_header X-Frame-Options DENY;`);
    lines.push(`    add_header X-XSS-Protection "1; mode=block";`);
    lines.push(`    add_header Referrer-Policy no-referrer;`);
    lines.push(`    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self';");`);
    lines.push(`    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";`);
    lines.push('');
  }

  // Body size
  lines.push(`    client_max_body_size ${config.maxBodySize};`);
  lines.push('');

  // Locations
  lines.push(`    location / {`);
  if (config.upstreamServers.length > 0) {
    lines.push(`        proxy_pass http://onion_backend;`);
    lines.push(`        proxy_set_header Host $host;`);
    lines.push(`        proxy_set_header X-Real-IP $remote_addr;`);
    lines.push(`        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`);
  } else {
    lines.push(`        try_files $uri $uri/ =404;`);
  }
  lines.push(`    }`);
  lines.push('');

  // Deny access to hidden files
  lines.push(`    location ~ /\\. {`);
  lines.push(`        deny all;`);
  lines.push(`        access_log off;`);
  lines.push(`        log_not_found off;`);
  lines.push(`    }`);
  lines.push('');

  // Logging
  lines.push(`    access_log /var/log/nginx/onion_access.log;`);
  lines.push(`    error_log /var/log/nginx/onion_error.log;`);

  lines.push(`}`);

  return lines.join('\n');
}

// Step-by-step Onion Service deployment guide
export const onionDeploymentSteps = [
  {
    title: 'Установка Tor',
    command: 'sudo apt update && sudo apt install tor',
    description: 'Установите Tor из официальных репозиториев вашей системы.',
  },
  {
    title: 'Настройка Onion Service в torrc',
    command: 'sudo nano /etc/tor/torrc',
    description: 'Добавьте строки HiddenServiceDir и HiddenServicePort в конфигурационный файл Tor.',
  },
  {
    title: 'Перезапуск Tor',
    command: 'sudo systemctl restart tor',
    description: 'Перезапустите Tor для применения новой конфигурации и генерации ключей.',
  },
  {
    title: 'Получение .onion адреса',
    command: 'sudo cat /var/lib/tor/hidden_service/hostname',
    description: 'В этом файле содержится ваш .onion-адрес. Сохраните его в безопасном месте.',
  },
  {
    title: 'Установка Nginx',
    command: 'sudo apt install nginx',
    description: 'Установите веб-сервер Nginx для обслуживания контента.',
  },
  {
    title: 'Настройка Nginx',
    command: 'sudo nano /etc/nginx/sites-available/onion',
    description: 'Создайте конфигурацию Nginx для обслуживания Onion-сервиса на localhost.',
  },
  {
    title: 'Создание контента',
    command: 'sudo mkdir -p /var/www/onion-site && echo "Hello Onion!" | sudo tee /var/www/onion-site/index.html',
    description: 'Создайте директорию для контента и поместите туда файлы вашего сайта.',
  },
  {
    title: 'Проверка Nginx',
    command: 'sudo nginx -t && sudo systemctl restart nginx',
    description: 'Проверьте конфигурацию Nginx и перезапустите его.',
  },
  {
    title: 'Тестирование',
    command: 'curl http://127.0.0.1:80',
    description: 'Убедитесь, что Nginx обслуживает контент на localhost.',
  },
  {
    title: 'Проверка Onion-сервиса',
    command: 'torsocks curl http://YOUR_ONION_ADDRESS.onion',
    description: 'Проверьте доступность вашего Onion-сервиса через Tor.',
  },
];

// Known legal Onion services
export const legalOnionServices = [
  { name: 'Facebook', address: 'facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion', description: 'Социальная сеть Facebook для доступа из стран с цензурой', category: 'Социальные сети' },
  { name: 'BBC News', address: 'bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion', description: 'Новостной сайт BBC World Service на нескольких языках', category: 'Медиа' },
  { name: 'ProPublica', address: 'p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd.onion', description: 'Некоммерческая редакция расследовательской журналистики', category: 'Медиа' },
  { name: 'DuckDuckGo', address: 'duckduckgogg42xjoc72x3sjasowy3ftvza7cozptlglztz4swgvgkxad.onion', description: 'Поисковая система, не отслеживающая пользователей', category: 'Поиск' },
  { name: 'ProtonMail', address: 'protonmailrmez3lotccipshtkleegetolb73fuirgj7r4o4vfu7ozyd.onion', description: 'Зашифрованный почтовый сервис', category: 'Почта' },
  { name: 'SecureDrop (NYT)', address: 'ej3kv4ebuugcmuwxctx5ic7zxh73rnxt42soi3tdneu2c2em55thufqd.onion', description: 'Платформа анонимного контакта New York Times', category: 'Безопасность' },
  { name: 'SecureDrop (Guardian)', address: 'xp44cagis447k3lp3q4g4u26k3xh7y2f5cnxdxlmsl2lfftcklq5r5id.onion', description: 'Платформа анонимного контакта The Guardian', category: 'Безопасность' },
  { name: 'Deutsche Welle', address: 'dwnewsgdrrvk3k2bzzrsmjzvkzz2n5xeweyc2q3s4ujeil4lsfq5jid.onion', description: 'Немецкая международная телерадиовещательная компания', category: 'Медиа' },
];
