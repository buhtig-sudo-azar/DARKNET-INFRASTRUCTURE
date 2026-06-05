// I2P Router section component
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TheoryCard } from './TheoryCard';
import { CodeBlock } from './CodeBlock';
import { ConfigGenerator } from './ConfigGenerator';
import { StepGuide } from './StepGuide';
import { i2pTheory, i2pComparisonTable } from '@/lib/data/i2p-theory';
import { i2pdInstallCommands, knownEepsites } from '@/lib/configs/i2pd';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const i2pdFields = [
  { key: 'ipv4', label: 'IPv4', type: 'boolean' as const, defaultValue: true },
  { key: 'ipv6', label: 'IPv6', type: 'boolean' as const, defaultValue: false },
  { key: 'dataDir', label: 'Data Directory', type: 'text' as const, defaultValue: '/var/lib/i2pd' },
  { key: 'httpPort', label: 'Web Console Port', type: 'number' as const, defaultValue: 7070 },
  { key: 'socksPort', label: 'SOCKS Proxy Port', type: 'number' as const, defaultValue: 4447 },
  { key: 'httpProxyPort', label: 'HTTP Proxy Port', type: 'number' as const, defaultValue: 4444 },
  { key: 'shareRatio', label: 'Share Ratio (%)', type: 'number' as const, defaultValue: 100 },
];

const i2pInstallSteps = [
  { title: 'Установка i2pd', command: 'sudo apt update && sudo apt install i2pd', description: 'Установите i2pd из репозиториев.' },
  { title: 'Настройка i2pd.conf', command: 'sudo nano /etc/i2pd/i2pd.conf', description: 'Отредактируйте конфигурационный файл.' },
  { title: 'Настройка туннелей', command: 'sudo nano /etc/i2pd/tunnels.conf', description: 'Добавьте конфигурации клиентских и серверных туннелей.' },
  { title: 'Запуск i2pd', command: 'sudo systemctl start i2pd && sudo systemctl enable i2pd', description: 'Запустите и включите автозапуск i2pd.' },
  { title: 'Проверка', command: 'curl --socks5-hostname 127.0.0.1:4447 http://ugha.i2p', description: 'Проверьте доступность I2P-сети через SOCKS-прокси.' },
  { title: 'Веб-консоль', command: '# Откройте http://127.0.0.1:7070 в браузере', description: 'Проверьте статус I2P-маршрутизатора через веб-консоль.' },
];

// Garlic routing visual states
const garlicSteps = [
  { label: 'Исходные сообщения', desc: 'Несколько сообщений от разных отправителей' },
  { label: 'Объединение (Garlic)', desc: 'Сообщения объединяются в один garlic-пакет' },
  { label: 'Шифрование слоями', desc: 'Каждый слой шифруется ключом своего узла' },
  { label: 'Транзит', desc: 'Пакет проходит через туннель I2P' },
  { label: 'Расшифровка', desc: 'Каждый узел снимает свой слой шифрования' },
  { label: 'Доставка', desc: 'Сообщения доставляются получателям' },
];

export function I2PSection() {
  const [garlicStep, setGarlicStep] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-sky-500/10">
          <span className="text-2xl">🕸️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-sky-400">{i2pTheory.title}</h2>
          <p className="text-muted-foreground text-sm">{i2pTheory.description}</p>
        </div>
      </div>

      <Tabs defaultValue="theory" className="space-y-4">
        <TabsList className="bg-card/50 border border-border">
          <TabsTrigger value="theory" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
            📖 Теория
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
            ⚙️ Конфигуратор
          </TabsTrigger>
          <TabsTrigger value="garlic" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
            🧄 Garlic Routing
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
            📊 Сравнение
          </TabsTrigger>
          <TabsTrigger value="eepsites" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
            🌐 Eepsites
          </TabsTrigger>
          <TabsTrigger value="install" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
            🚀 Установка
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theory">
          <TheoryCard sections={i2pTheory.sections} faq={i2pTheory.faq} accentColor="#0284C7" />
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            <ConfigGenerator
              title="Конфигуратор i2pd (i2pd.conf)"
              description="Настройте параметры I2P-маршрутизатора и сгенерируйте конфигурационный файл"
              fields={i2pdFields}
              apiEndpoint="/api/i2p"
              apiType="i2pd"
              accentColor="#0284C7"
            />

            <Separator />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sky-400 text-lg">🔧 Пример конфигурации туннеля</CardTitle>
                <CardDescription>Клиентский и серверный туннели в tunnels.conf</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock
                  code={`## Клиентский туннель для доступа к eepsite\n[my-eepsite-client]\ntype = client\naddress = 127.0.0.1\nport = 8080\ndestination = ughdhyxvcscfx3gecskngq24y5vdpx3yqcdpb5EPb3gksc3z7ia.b32.i2p\nkeys = client-keys.dat`}
                  language="ini"
                  title="Клиентский туннель"
                />
                <CodeBlock
                  code={`## Серверный туннель для публикации eepsite\n[my-eepsite-server]\ntype = server\nhost = 127.0.0.1\nport = 80\ninport = 80\nkeys = server-keys.dat`}
                  language="ini"
                  title="Серверный туннель"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="garlic">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sky-400">🧄 Визуализация Garlic Routing</CardTitle>
              <CardDescription>Пошаговая демонстрация объединения сообщений в garlic-пакет</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Step navigation */}
                <div className="flex items-center gap-2 flex-wrap">
                  {garlicSteps.map((step, i) => (
                    <Button
                      key={i}
                      variant={garlicStep === i ? 'default' : 'outline'}
                      size="sm"
                      className={garlicStep === i ? 'bg-sky-600 hover:bg-sky-700' : ''}
                      onClick={() => setGarlicStep(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                {/* Step visualization */}
                <div className="p-6 rounded-lg bg-card/50 border border-border min-h-[200px] flex flex-col items-center justify-center">
                  <Badge variant="outline" className="mb-3 border-sky-500 text-sky-400">
                    Шаг {garlicStep + 1} из {garlicSteps.length}
                  </Badge>
                  <h3 className="text-lg font-semibold text-sky-400 mb-2">
                    {garlicSteps[garlicStep].label}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {garlicSteps[garlicStep].desc}
                  </p>

                  {/* Visual representation */}
                  <div className="mt-6 flex items-center gap-4 flex-wrap justify-center">
                    {garlicStep === 0 && (
                      <>
                        <div className="w-12 h-8 rounded bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-xs">Msg1</div>
                        <div className="w-12 h-8 rounded bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-xs">Msg2</div>
                        <div className="w-12 h-8 rounded bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-xs">Msg3</div>
                      </>
                    )}
                    {garlicStep === 1 && (
                      <div className="px-6 py-3 rounded-lg bg-sky-500/30 border-2 border-sky-500 flex items-center gap-2">
                        <span className="text-xs">🧄</span>
                        <span className="text-sm font-medium">Garlic Package</span>
                        <div className="flex gap-1 ml-2">
                          <div className="w-3 h-3 rounded bg-sky-400/50" />
                          <div className="w-3 h-3 rounded bg-sky-400/50" />
                          <div className="w-3 h-3 rounded bg-sky-400/50" />
                        </div>
                      </div>
                    )}
                    {garlicStep === 2 && (
                      <div className="px-6 py-3 rounded-lg bg-sky-500/30 border-2 border-sky-500 flex flex-col items-center gap-1">
                        <span className="text-sm">🔒 Слой 3 (Узел C)</span>
                        <span className="text-sm">🔒 Слой 2 (Узел B)</span>
                        <span className="text-sm">🔒 Слой 1 (Узел A)</span>
                      </div>
                    )}
                    {garlicStep >= 3 && garlicStep <= 4 && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center text-xs">A</div>
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center text-xs">B</div>
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center text-xs">C</div>
                      </div>
                    )}
                    {garlicStep === 5 && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs">Dest1</div>
                        <div className="w-12 h-8 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs">Dest2</div>
                        <div className="w-12 h-8 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs">Dest3</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGarlicStep(Math.max(0, garlicStep - 1))}
                    disabled={garlicStep === 0}
                  >
                    ← Назад
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGarlicStep(Math.min(garlicSteps.length - 1, garlicStep + 1))}
                    disabled={garlicStep === garlicSteps.length - 1}
                    className="border-sky-500 text-sky-400 hover:bg-sky-500/10"
                  >
                    Далее →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sky-400">📊 I2P vs Tor vs Freenet</CardTitle>
              <CardDescription>Сравнение анонимных сетей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground font-medium">Характеристика</th>
                      <th className="text-left p-3 text-sky-400 font-medium">I2P</th>
                      <th className="text-left p-3 text-purple-400 font-medium">Tor</th>
                      <th className="text-left p-3 text-amber-400 font-medium">Freenet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {i2pComparisonTable.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                        <td className="p-3 font-medium">{row.feature}</td>
                        <td className="p-3 text-muted-foreground">{row.i2p}</td>
                        <td className="p-3 text-muted-foreground">{row.tor}</td>
                        <td className="p-3 text-muted-foreground">{row.freenet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eepsites">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sky-400">🌐 Каталог известных I2P-сервисов</CardTitle>
              <CardDescription>Популярные eepsites и сервисы внутри сети I2P</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {knownEepsites.map((site, i) => (
                  <div key={i} className="p-3 rounded-lg bg-card/50 border border-border/50 hover:border-sky-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{site.name}</span>
                      <Badge variant="outline" className="text-[10px] border-sky-500/50 text-sky-400">.i2p</Badge>
                    </div>
                    <code className="text-xs text-sky-400/70 block mb-1">{site.address}</code>
                    <p className="text-xs text-muted-foreground">{site.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install">
          <StepGuide title="Установка i2pd на Linux" steps={i2pInstallSteps} accentColor="#0284C7" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
