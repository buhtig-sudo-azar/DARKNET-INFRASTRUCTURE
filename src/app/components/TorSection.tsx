// Tor Relay / Exit Node section component
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { TheoryCard } from './TheoryCard';
import { CodeBlock } from './CodeBlock';
import { ConfigGenerator } from './ConfigGenerator';
import { StepGuide } from './StepGuide';
import { torTheory } from '@/lib/data/tor-theory';
import { torrcOptionDescriptions } from '@/lib/configs/torrc';
import { Shield, Zap, Globe, Lock } from 'lucide-react';

const torRelayFields = [
  { key: 'nodeType', label: 'Тип ноды', type: 'select' as const, defaultValue: 'relay', options: [
    { value: 'relay', label: 'Relay (Middle/Guard)' },
    { value: 'guard', label: 'Guard (Entry)' },
    { value: 'exit', label: 'Exit Node' },
    { value: 'bridge', label: 'Bridge (Мост)' },
  ]},
  { key: 'nickname', label: 'Nickname', type: 'text' as const, defaultValue: 'MyAwesomeRelay', placeholder: 'MyRelayName' },
  { key: 'contactEmail', label: 'Contact Email', type: 'text' as const, defaultValue: 'admin@example.com' },
  { key: 'orPort', label: 'ORPort', type: 'number' as const, defaultValue: 9001 },
  { key: 'dirPort', label: 'DirPort', type: 'number' as const, defaultValue: 9030 },
  { key: 'bandwidthRate', label: 'Bandwidth Rate', type: 'text' as const, defaultValue: '100 MBytes' },
  { key: 'bandwidthBurst', label: 'Bandwidth Burst', type: 'text' as const, defaultValue: '200 MBytes' },
  { key: 'exitPolicy', label: 'Exit Policy', type: 'select' as const, defaultValue: 'default', options: [
    { value: 'default', label: 'Default (accept all)' },
    { value: 'reduced', label: 'Reduced (без почты/P2P)' },
  ]},
  { key: 'enableIPv6', label: 'IPv6', type: 'boolean' as const, defaultValue: false },
  { key: 'hardwareAccel', label: 'Hardware AES', type: 'boolean' as const, defaultValue: true },
  { key: 'disableDebugger', label: 'Disable Debugger', type: 'boolean' as const, defaultValue: true },
];

const torInstallSteps = [
  { title: 'Установка Tor', command: 'sudo apt update && sudo apt install tor', description: 'Установите Tor из официальных репозиториев.' },
  { title: 'Редактирование torrc', command: 'sudo nano /etc/tor/torrc', description: 'Откройте конфигурационный файл Tor.' },
  { title: 'Вставка конфигурации', command: '# Вставьте сгенерированную конфигурацию в torrc', description: 'Скопируйте конфигурацию из генератора выше и вставьте в torrc.' },
  { title: 'Перезапуск Tor', command: 'sudo systemctl restart tor', description: 'Перезапустите Tor для применения новой конфигурации.' },
  { title: 'Проверка статуса', command: 'sudo systemctl status tor && sudo tail -f /var/log/syslog | grep tor', description: 'Убедитесь, что Tor запустился без ошибок.' },
  { title: 'Проверка ретранслятора', command: 'curl https://check.torproject.org/torbulkexitlist', description: 'Через некоторое время ваш узел появится в списке ретрансляторов.' },
];

// Exit node safety checklist
const exitChecklist = [
  'Ознакомьтесь с законодательством вашей страны о выходных узлах Tor',
  'Используйте выделенный сервер (VPS), а не домашнее подключение',
  'Настройте ReducedExitPolicy для минимизации жалоб',
  'Укажите ContactInfo для получения уведомлений о проблемах',
  'Настройте обратный DNS (rDNS) для IP-адреса узла',
  'Рассмотрите юридическую страховку или поддержку организации',
  'Настройте мониторинг и автоматическое оповещение',
  'Ведите логи в минимальном объёме (notice level)',
];

export function TorSection() {
  const [showRouting, setShowRouting] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <span className="text-2xl">🧅</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-400">{torTheory.title}</h2>
          <p className="text-muted-foreground text-sm">{torTheory.description}</p>
        </div>
      </div>

      <Tabs defaultValue="theory" className="space-y-4">
        <TabsList className="bg-card/50 border border-border">
          <TabsTrigger value="theory" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            📖 Теория
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            ⚙️ Конфигуратор
          </TabsTrigger>
          <TabsTrigger value="routing" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            🔄 Маршрутизация
          </TabsTrigger>
          <TabsTrigger value="install" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            🚀 Установка
          </TabsTrigger>
          <TabsTrigger value="checklist" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            ✅ Чеклист
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theory">
          <TheoryCard sections={torTheory.sections} faq={torTheory.faq} accentColor="#7C3AED" />
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            <ConfigGenerator
              title="Конфигуратор Tor Relay (torrc)"
              description="Настройте параметры вашего Tor-ретранслятора и сгенерируйте конфигурационный файл"
              fields={torRelayFields}
              apiEndpoint="/api/tor"
              apiType="relay"
              accentColor="#7C3AED"
            />

            <Separator />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-purple-400 text-lg">📝 Описание опций torrc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(torrcOptionDescriptions).map(([key, desc]) => (
                    <div key={key} className="p-2 rounded-md bg-muted/20">
                      <code className="text-purple-400 text-sm font-mono">{key}</code>
                      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routing">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-purple-400">🔄 Визуализация маршрутизации Tor</CardTitle>
              <CardDescription>Анимация прохождения пакета через 3 хопа (Guard → Middle → Exit)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 py-8">
                {/* Routing visualization */}
                <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
                  {/* Client */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-emerald-500" />
                    </div>
                    <span className="text-xs font-medium text-emerald-400">Клиент</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>

                  {/* Guard */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center relative">
                      <Shield className="h-6 w-6 text-purple-500" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[8px] text-white flex items-center justify-center">1</div>
                    </div>
                    <span className="text-xs font-medium text-purple-400">Guard</span>
                    <span className="text-[10px] text-muted-foreground">Снимает 1-й слой</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: `${i * 0.2 + 0.3}s` }} />
                    ))}
                  </div>

                  {/* Middle */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center relative">
                      <Zap className="h-6 w-6 text-purple-500" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[8px] text-white flex items-center justify-center">2</div>
                    </div>
                    <span className="text-xs font-medium text-purple-400">Middle</span>
                    <span className="text-[10px] text-muted-foreground">Снимает 2-й слой</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: `${i * 0.2 + 0.6}s` }} />
                    ))}
                  </div>

                  {/* Exit */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center relative">
                      <Lock className="h-6 w-6 text-purple-500" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[8px] text-white flex items-center justify-center">3</div>
                    </div>
                    <span className="text-xs font-medium text-purple-400">Exit</span>
                    <span className="text-[10px] text-muted-foreground">Снимает 3-й слой</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: `${i * 0.2 + 0.9}s` }} />
                    ))}
                  </div>

                  {/* Server */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gray-500/20 border-2 border-gray-500 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-400">Сервер</span>
                  </div>
                </div>

                {/* Encryption layers explanation */}
                <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-semibold text-sm mb-3 text-purple-400">Луковичное шифрование (слои)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded bg-purple-500/10">
                      <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-xs">🔒3</div>
                      <div>
                        <p className="text-sm font-medium">Слой 3 (Exit key)</p>
                        <p className="text-xs text-muted-foreground">Снимается Exit-узлом, раскрывает destination</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded bg-purple-500/10">
                      <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-xs">🔒2</div>
                      <div>
                        <p className="text-sm font-medium">Слой 2 (Middle key)</p>
                        <p className="text-xs text-muted-foreground">Снимается Middle-узлом, раскрывает адрес Exit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded bg-purple-500/10">
                      <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-xs">🔒1</div>
                      <div>
                        <p className="text-sm font-medium">Слой 1 (Guard key)</p>
                        <p className="text-xs text-muted-foreground">Снимается Guard-узлом, раскрывает адрес Middle</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded bg-emerald-500/10">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs">📨</div>
                      <div>
                        <p className="text-sm font-medium">Исходные данные</p>
                        <p className="text-xs text-muted-foreground">Видны только клиенту (зашифрованы end-to-end при HTTPS)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install">
          <StepGuide title="Установка и запуск Tor Relay" steps={torInstallSteps} accentColor="#7C3AED" />
        </TabsContent>

        <TabsContent value="checklist">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-purple-400">✅ Чеклист безопасности Exit Node</CardTitle>
              <CardDescription>Обязательные шаги перед запуском выходного узла Tor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exitChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/30 border border-border/50">
                    <div className="w-5 h-5 rounded border-2 border-purple-500/50 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
