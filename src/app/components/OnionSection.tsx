// Onion Services section component
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { TheoryCard } from './TheoryCard';
import { CodeBlock } from './CodeBlock';
import { ConfigGenerator } from './ConfigGenerator';
import { StepGuide } from './StepGuide';
import { onionTheory } from '@/lib/data/onion-theory';
import { onionDeploymentSteps, legalOnionServices } from '@/lib/configs/nginx-onion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { FloatingChatExpert } from './FloatingChatExpert';

const onionSuggestedQuestions = [
  'Что такое Onion Service v3?',
  'Как работают Introduction Point и Rendezvous?',
  'Как настроить Client Authorization для .onion?',
  'Какие легальные сервисы работают в .onion?',
];

const nginxFields = [
  { key: 'onionAddress', label: 'Onion Address', type: 'text' as const, defaultValue: 'your-onion-address.onion' },
  { key: 'listenPort', label: 'Listen Port', type: 'number' as const, defaultValue: 80 },
  { key: 'serverName', label: 'Server Name', type: 'text' as const, defaultValue: 'localhost' },
  { key: 'documentRoot', label: 'Document Root', type: 'text' as const, defaultValue: '/var/www/onion-site' },
  { key: 'enableSecurityHeaders', label: 'Security Headers', type: 'boolean' as const, defaultValue: true },
  { key: 'maxBodySize', label: 'Max Body Size', type: 'text' as const, defaultValue: '10M' },
];

const onionConfigFields = [
  { key: 'serviceName', label: 'Название сервиса', type: 'text' as const, defaultValue: 'my-onion-service' },
  { key: 'hiddenServiceDir', label: 'Hidden Service Dir', type: 'text' as const, defaultValue: '/var/lib/tor/hidden_service/' },
  { key: 'port', label: 'Onion Port', type: 'number' as const, defaultValue: 80 },
  { key: 'targetHost', label: 'Target Host', type: 'text' as const, defaultValue: '127.0.0.1' },
  { key: 'targetPort', label: 'Target Port', type: 'number' as const, defaultValue: 80 },
  { key: 'clientAuth', label: 'Client Authorization', type: 'boolean' as const, defaultValue: false },
];

// 6-step connection process
const connectionSteps = [
  { num: 1, title: 'Клиент узнаёт .onion-адрес', desc: 'Получает 56-символьный v3-адрес из внешнего источника', color: '#10B981' },
  { num: 2, title: 'Извлечение дескриптора', desc: 'Клиент загружает зашифрованный дескриптор с HSDir-узлов', color: '#7C3AED' },
  { num: 3, title: 'Выбор Rendezvous Point', desc: 'Клиент выбирает RP и устанавливает цепочку к нему', color: '#0284C7' },
  { num: 4, title: 'Запрос через Introduction Point', desc: 'Клиент отправляет introduce-сообщение на IP сервиса', color: '#DC2626' },
  { num: 5, title: 'Сервер подключается к RP', desc: 'Onion-сервис устанавливает цепочку к Rendezvous Point', color: '#DC2626' },
  { num: 6, title: 'Защищённый канал', desc: 'Данные передаются через RP по зашифрованному каналу', color: '#10B981' },
];

export function OnionSection() {
  const [connStep, setConnStep] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="p-2 rounded-lg bg-red-500/10">
          <span className="text-2xl">🔗</span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-500">{onionTheory.title}</h2>
          <p className="text-muted-foreground text-sm">{onionTheory.description}</p>
        </div>
      </div>

      <Tabs defaultValue="theory" className="space-y-4">
        <div className="overflow-x-auto -mb-px tabs-scroll-container">
        <TabsList className="bg-card/50 border border-border w-max min-w-full">
          <TabsTrigger value="theory" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            📖 Теория
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            ⚙️ Конфигуратор
          </TabsTrigger>
          <TabsTrigger value="connection" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            🔄 Подключение
          </TabsTrigger>
          <TabsTrigger value="catalog" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            📋 Каталог
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            🚀 Развёртывание
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="theory">
          <TheoryCard sections={onionTheory.sections} faq={onionTheory.faq} accentColor="#DC2626" />
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            <ConfigGenerator
              title="Конфигуратор Onion Service (torrc)"
              description="Настройте параметры Onion-сервиса для Tor"
              fields={onionConfigFields}
              apiEndpoint="/api/tor"
              apiType="onion"
              accentColor="#DC2626"
            />

            <Separator />

            <ConfigGenerator
              title="Конфигуратор Nginx для Onion Service"
              description="Настройте Nginx для обслуживания вашего Onion-сервиса"
              fields={nginxFields}
              apiEndpoint="/api/onion"
              apiType="nginx"
              accentColor="#DC2626"
            />

            <Separator />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-red-500 text-lg">🔑 V3 Client Authorization</CardTitle>
                <CardDescription>Создание ключей для ограничения доступа к Onion-сервису</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`## Генерация ключей Client Authorization (v3)\n\n# На стороне сервера:\n# Создайте директорию для авторизованных клиентов\nsudo mkdir -p /var/lib/tor/hidden_service/authorized_clients/\n\n# Добавьте публичный ключ клиента (файл: client1.auth)\n# Формат: descriptor:x25519:PUBLIC_KEY_BASE64\ndescriptor:x25519:AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz==\n\n# На стороне клиента:\n# Создайте файл авторизации (файл: ~/.tor/onion_auth/mysite.auth_private)\n# Формат: HOSTNAME.onion:x25519:PRIVATE_KEY_BASE64\nmysite.onion:x25519:ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa==`}
                  language="bash"
                  title="Client Authorization (v3)"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="connection">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-red-500">🔄 6 шагов подключения к Onion Service</CardTitle>
              <CardDescription>Интерактивная визуализация процесса установления соединения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Step navigation */}
                <div className="flex items-center gap-1 flex-wrap">
                  {connectionSteps.map((step) => (
                    <Button
                      key={step.num}
                      variant={connStep === step.num - 1 ? 'default' : 'outline'}
                      size="sm"
                      className={connStep === step.num - 1 ? '' : ''}
                      style={connStep === step.num - 1 ? { backgroundColor: step.color } : {}}
                      onClick={() => setConnStep(step.num - 1)}
                    >
                      {step.num}
                    </Button>
                  ))}
                </div>

                {/* Current step visualization */}
                <div className="p-6 rounded-lg bg-card/50 border border-border min-h-[250px] flex flex-col items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4"
                    style={{ backgroundColor: `${connectionSteps[connStep].color}20`, color: connectionSteps[connStep].color, border: `2px solid ${connectionSteps[connStep].color}` }}
                  >
                    {connectionSteps[connStep].num}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: connectionSteps[connStep].color }}>
                    {connectionSteps[connStep].title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {connectionSteps[connStep].desc}
                  </p>

                  {/* Step-specific visual */}
                  <div className="mt-6 flex items-center gap-4 flex-wrap justify-center">
                    {connStep === 0 && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-xs">Пользователь</div>
                        <ArrowRight className="h-4 w-4 text-emerald-500" />
                        <div className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-xs font-mono">xxxxx...xxxxx.onion</div>
                      </div>
                    )}
                    {connStep === 1 && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-xs">Клиент</div>
                        <ArrowRight className="h-4 w-4 text-purple-500" />
                        <div className="px-3 py-1.5 rounded bg-purple-500/20 border border-purple-500/50 text-xs">HSDir</div>
                        <ArrowRight className="h-4 w-4 text-red-500" />
                        <div className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-xs">Descriptor 🔒</div>
                      </div>
                    )}
                    {connStep === 2 && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-xs">Клиент</div>
                        <ArrowRight className="h-4 w-4 text-sky-500" />
                        <div className="px-3 py-1.5 rounded bg-sky-500/20 border border-sky-500/50 text-xs">Rendezvous 🍪</div>
                      </div>
                    )}
                    {connStep === 3 && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-xs">Клиент</div>
                        <ArrowRight className="h-4 w-4 text-red-500" />
                        <div className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-xs">Intro Point</div>
                        <ArrowRight className="h-4 w-4 text-red-500" />
                        <div className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-xs">Сервер</div>
                      </div>
                    )}
                    {connStep === 4 && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-xs">Сервер</div>
                        <ArrowRight className="h-4 w-4 text-sky-500" />
                        <div className="px-3 py-1.5 rounded bg-sky-500/20 border border-sky-500/50 text-xs">Rendezvous 🍪</div>
                      </div>
                    )}
                    {connStep === 5 && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-xs">Клиент</div>
                        <ArrowLeft className="h-4 w-4 text-sky-500" />
                        <div className="px-3 py-1.5 rounded bg-sky-500/20 border border-sky-500/50 text-xs">RP 🔒</div>
                        <ArrowRight className="h-4 w-4 text-red-500" />
                        <div className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/50 text-xs">Сервер</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConnStep(Math.max(0, connStep - 1))}
                    disabled={connStep === 0}
                  >
                    ← Назад
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConnStep(Math.min(5, connStep + 1))}
                    disabled={connStep === 5}
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    Далее →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-red-500">📋 Каталог легальных Onion-сервисов</CardTitle>
              <CardDescription>Известные организации, предоставляющие доступ через .onion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {legalOnionServices.map((service, i) => (
                  <div key={i} className="p-3 rounded-lg bg-card/50 border border-border/50 hover:border-red-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{service.name}</span>
                      <Badge variant="outline" className="text-[10px] border-red-500/50 text-red-400">
                        {service.category}
                      </Badge>
                    </div>
                    <code className="text-[10px] text-red-400/70 block mb-1 break-all">{service.address}</code>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy">
          <StepGuide
            title="Развёртывание Nginx + Onion Service"
            steps={onionDeploymentSteps}
            accentColor="#DC2626"
          />
        </TabsContent>
      </Tabs>

      <FloatingChatExpert
        topic="Onion-сервисы"
        accentColor="#DC2626"
        icon="🔗"
        systemContext="Onion-сервисы (.onion) — Hidden Service v3, Introduction Point, Rendezvous Point, дескрипторы, HSDir, Client Authorization, OnionBalance, Nginx конфигурация для Onion, легальные Onion-сервисы"
        suggestedQuestions={onionSuggestedQuestions}
      />
    </div>
  );
}
