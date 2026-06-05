// Main page: Dark/Deep Web Network Infrastructure - Academic Project
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TorSection } from './components/TorSection';
import { SocksSection } from './components/SocksSection';
import { I2PSection } from './components/I2PSection';
import { OnionSection } from './components/OnionSection';
import { ChatBot } from './components/ChatBot';
import { NetworkMap } from './components/NetworkMap';
import {
  Shield,
  Globe,
  Zap,
  Lock,
  Bot,
  Map,
  Home,
  ChevronRight,
} from 'lucide-react';

const sections = [
  {
    id: 'tor',
    title: 'Tor Relay / Exit Node',
    icon: '🧅',
    color: '#7C3AED',
    description: 'Луковичная маршрутизация, типы нод, конфигуратор torrc, визуализация маршрутизации',
    keywords: ['Onion Routing', 'Guard/Exit', '3 хопа', 'DirAuth'],
  },
  {
    id: 'socks',
    title: 'SOCKS5 Proxy',
    icon: '🔌',
    color: '#059669',
    description: 'Протокол SOCKS5, Dante, Tor как прокси, предотвращение утечек DNS',
    keywords: ['Dante', 'socks5h', 'DNS Leak', 'Privoxy'],
  },
  {
    id: 'i2p',
    title: 'I2P Router',
    icon: '🕸️',
    color: '#0284C7',
    description: 'Garlic Routing, туннели I2P, eepsites, сравнение с Tor',
    keywords: ['Garlic', 'Floodfill', 'i2pd', 'eepsites'],
  },
  {
    id: 'onion',
    title: 'Onion-сервисы',
    icon: '🔗',
    color: '#DC2626',
    description: '.onion-сервисы, v2 vs v3, Client Auth, OnionBalance',
    keywords: ['v3', 'Intro Point', 'Rendezvous', 'Client Auth'],
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-400" />
              <h1 className="text-lg font-bold">
                <span className="text-emerald-400">Dark</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-sky-400">Deep Web</span>
                <span className="text-muted-foreground ml-2 text-sm font-normal">Infrastructure</span>
              </h1>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
              Академический проект
            </Badge>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-12 gap-1">
              <TabsTrigger
                value="home"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 h-9"
              >
                <Home className="h-4 w-4 mr-1" />
                Главная
              </TabsTrigger>
              <TabsTrigger
                value="tor"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 h-9"
              >
                🧅 Tor
              </TabsTrigger>
              <TabsTrigger
                value="socks"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 h-9"
              >
                🔌 SOCKS5
              </TabsTrigger>
              <TabsTrigger
                value="i2p"
                className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400 h-9"
              >
                🕸️ I2P
              </TabsTrigger>
              <TabsTrigger
                value="onion"
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 h-9"
              >
                🔗 Onion
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 h-9"
              >
                <Bot className="h-4 w-4 mr-1" />
                Чат
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 h-9"
              >
                <Map className="h-4 w-4 mr-1" />
                Карта
              </TabsTrigger>
            </TabsList>

            <div className="sr-only">
              {/* Hidden tab contents for non-home tabs rendered below */}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Hero section */}
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold mb-3">
                <span className="text-emerald-400">Dark/Deep Web</span>{' '}
                <span className="text-foreground">Network Infrastructure</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Образовательная интерактивная платформа для изучения сетевой инфраструктуры
                анонимных сетей. Теория, конфигураторы, визуализации и ИИ-ассистент — всё на русском языке.
              </p>
            </div>

            {/* Quick access cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Card
                  key={section.id}
                  className="border-border/50 hover:border-opacity-80 cursor-pointer transition-all group"
                  style={{ '--hover-border': section.color } as React.CSSProperties}
                  onClick={() => setActiveTab(section.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{section.icon}</span>
                        <CardTitle style={{ color: section.color }} className="text-lg">
                          {section.title}
                        </CardTitle>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">{section.description}</CardDescription>
                    <div className="flex gap-1 flex-wrap">
                      {section.keywords.map((kw) => (
                        <Badge
                          key={kw}
                          variant="outline"
                          className="text-[10px]"
                          style={{ borderColor: `${section.color}40`, color: section.color }}
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Network Map */}
            <NetworkMap />

            <Separator />

            {/* Info section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/30">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">4 раздела теории</h3>
                  <p className="text-xs text-muted-foreground">
                    Tor, SOCKS5, I2P, Onion-сервисы — подробные теоретические материалы с FAQ
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/30">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-8 w-8 text-sky-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Интерактивные конфигураторы</h3>
                  <p className="text-xs text-muted-foreground">
                    Генерация torrc, sockd.conf, i2pd.conf, nginx.conf с пояснениями к каждой опции
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/30">
                <CardContent className="pt-6 text-center">
                  <Lock className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">ИИ-ассистент</h3>
                  <p className="text-xs text-muted-foreground">
                    Эксперт по Dark/Deep Web инфраструктуре ответит на ваши вопросы с стримингом
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'tor' && <TorSection />}
        {activeTab === 'socks' && <SocksSection />}
        {activeTab === 'i2p' && <I2PSection />}
        {activeTab === 'onion' && <OnionSection />}
        {activeTab === 'chat' && <ChatBot />}
        {activeTab === 'map' && <NetworkMap />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>Академический проект: Dark/Deep Web Network Infrastructure — образовательная платформа</p>
          <p className="mt-1">Tor • SOCKS5 • I2P • Onion Services — Все материалы на русском языке</p>
        </div>
      </footer>
    </div>
  );
}
