// SOCKS5 Proxy section component
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TheoryCard } from './TheoryCard';
import { CodeBlock } from './CodeBlock';
import { ConfigGenerator } from './ConfigGenerator';
import { StepGuide } from './StepGuide';
import { socksTheory, socksComparisonTable } from '@/lib/data/socks-theory';
import { danteInstallCommands, firefoxSocksConfig, privoxyConfig } from '@/lib/configs/sockd';
import { FloatingChatExpert } from './FloatingChatExpert';

const socksSuggestedQuestions = [
  'Зачем нужен SOCKS5, если есть VPN?',
  'Как предотвратить утечки DNS через SOCKS5?',
  'Что такое socks5h и чем отличается от socks5?',
  'Как настроить Privoxy с Tor?',
];

const danteFields = [
  { key: 'internalAddress', label: 'Внутренний адрес', type: 'text' as const, defaultValue: '0.0.0.0', placeholder: '0.0.0.0' },
  { key: 'internalPort', label: 'Порт', type: 'number' as const, defaultValue: 1080 },
  { key: 'externalInterface', label: 'Внешний интерфейс', type: 'text' as const, defaultValue: 'eth0' },
  { key: 'authMethod', label: 'Аутентификация', type: 'select' as const, defaultValue: 'username', options: [
    { value: 'none', label: 'Без аутентификации' },
    { value: 'username', label: 'Username/Password' },
    { value: 'pam', label: 'PAM (системные пользователи)' },
  ]},
  { key: 'logOutput', label: 'Лог-файл', type: 'text' as const, defaultValue: '/var/log/sockd.log' },
  { key: 'enableUDP', label: 'UDP ASSOCIATE', type: 'boolean' as const, defaultValue: false },
];

const socksInstallSteps = [
  { title: 'Установка Dante', command: 'sudo apt update && sudo apt install dante-server', description: 'Установите SOCKS5-сервер Dante из репозиториев.' },
  { title: 'Создание пользователя', command: 'sudo useradd -r -s /bin/false sockd_user && sudo echo "sockd_user:YourPassword" | sudo chpasswd', description: 'Создайте системного пользователя для аутентификации SOCKS5.' },
  { title: 'Конфигурация', command: 'sudo nano /etc/dante/sockd.conf', description: 'Вставьте сгенерированную конфигурацию Dante.' },
  { title: 'Создание лог-файла', command: 'sudo touch /var/log/sockd.log && sudo chown proxy:nogroup /var/log/sockd.log', description: 'Создайте лог-файл с правильными правами.' },
  { title: 'Запуск Dante', command: 'sudo systemctl start danted && sudo systemctl enable danted', description: 'Запустите и включите автозапуск Dante.' },
  { title: 'Тестирование', command: 'curl --socks5-hostname sockd_user:YourPassword@127.0.0.1:1080 https://api.ipify.org', description: 'Проверьте работоспособность SOCKS5-прокси.' },
];

export function SocksSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <span className="text-2xl">🔌</span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-500">{socksTheory.title}</h2>
          <p className="text-muted-foreground text-sm">{socksTheory.description}</p>
        </div>
      </div>

      <Tabs defaultValue="theory" className="space-y-4">
        <div className="overflow-x-auto -mb-px tabs-scroll-container">
        <TabsList className="bg-card/50 border border-border w-max min-w-full">
          <TabsTrigger value="theory" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            📖 Теория
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            ⚙️ Конфигуратор
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            📊 Сравнение
          </TabsTrigger>
          <TabsTrigger value="browser" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            🌐 Браузер
          </TabsTrigger>
          <TabsTrigger value="install" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            🚀 Установка
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="theory">
          <TheoryCard sections={socksTheory.sections} faq={socksTheory.faq} accentColor="#059669" />
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            <ConfigGenerator
              title="Конфигуратор Dante (sockd.conf)"
              description="Настройте SOCKS5-сервер Dante и сгенерируйте конфигурационный файл"
              fields={danteFields}
              apiEndpoint="/api/socks"
              apiType="dante"
              accentColor="#059669"
            />

            <Separator />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-emerald-500 text-lg">🔗 Tor как SOCKS5-прокси</CardTitle>
                <CardDescription>Стандартная конфигурация Tor SOCKS5 для клиента</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`## Tor SOCKS5 Proxy Configuration\nSocksPort 9050\nSocksPolicy accept 127.0.0.1\nSocksPolicy reject *\nSafeSocks 1\nTestSocks 1`}
                  language="ini"
                  title="torrc — SOCKS5 конфигурация"
                />
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-emerald-500 text-lg">🔗 Privoxy + Tor</CardTitle>
                <CardDescription>HTTP-to-SOCKS5 конвертер для приложений без нативной поддержки SOCKS5</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={privoxyConfig} language="ini" title="Privoxy Configuration" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-emerald-500">📊 SOCKS5 vs HTTP Proxy vs VPN</CardTitle>
              <CardDescription>Сравнительная таблица технологий проксирования</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground font-medium">Характеристика</th>
                      <th className="text-left p-3 text-emerald-400 font-medium">SOCKS5</th>
                      <th className="text-left p-3 text-blue-400 font-medium">HTTP Proxy</th>
                      <th className="text-left p-3 text-amber-400 font-medium">VPN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socksComparisonTable.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                        <td className="p-3 font-medium">{row.feature}</td>
                        <td className="p-3 text-muted-foreground">{row.socks5}</td>
                        <td className="p-3 text-muted-foreground">{row.httpProxy}</td>
                        <td className="p-3 text-muted-foreground">{row.vpn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browser">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-emerald-500">🌐 Настройка браузера для SOCKS5</CardTitle>
              <CardDescription>Конфигурация Firefox для работы через Tor SOCKS5 с защитой от утечек</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={firefoxSocksConfig} language="ini" title="Firefox about:config настройки" />

              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-amber-400 font-medium mb-1">⚠️ Важно: проверка утечек</p>
                <p className="text-xs text-muted-foreground">
                  После настройки проверьте отсутствие утечек DNS и WebRTC на ipleak.net и browserleaks.com.
                  Убедитесь, что network.proxy.socks_remote_dns = true (предотвращает DNS leak).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install">
          <StepGuide title="Установка Dante SOCKS5" steps={socksInstallSteps} accentColor="#059669" />
        </TabsContent>
      </Tabs>

      <FloatingChatExpert
        topic="SOCKS5"
        accentColor="#059669"
        icon="🔌"
        systemContext="SOCKS5-прокси — протокол SOCKS5, Dante сервер, аутентификация, UDP ASSOCIATE, Tor как SOCKS5-прокси, Privoxy, предотвращение утечек DNS, настройка браузера"
        suggestedQuestions={socksSuggestedQuestions}
      />
    </div>
  );
}
