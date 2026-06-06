// Interactive Network Map visualization component
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  description: string;
  type: 'network' | 'node' | 'client';
}

interface NetworkLink {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

const nodes: NetworkNode[] = [
  { id: 'client', label: 'Клиент', x: 80, y: 200, color: '#10B981', description: 'Пользователь, инициирующий соединение через анонимные сети', type: 'client' },
  { id: 'tor-guard', label: 'Guard Node', x: 250, y: 100, color: '#7C3AED', description: 'Входной узел Tor — знает IP клиента, но не destination', type: 'node' },
  { id: 'tor-middle', label: 'Middle Node', x: 420, y: 100, color: '#7C3AED', description: 'Промежуточный узел Tor — ретранслирует зашифрованный трафик', type: 'node' },
  { id: 'tor-exit', label: 'Exit Node', x: 590, y: 100, color: '#7C3AED', description: 'Выходной узел Tor — видит destination, но не IP клиента', type: 'node' },
  { id: 'socks5', label: 'SOCKS5 Proxy', x: 250, y: 280, color: '#059669', description: 'SOCKS5-прокси (Dante/Tor) — перенаправляет трафик через Tor', type: 'node' },
  { id: 'i2p-outbound', label: 'I2P Outbound', x: 420, y: 300, color: '#0284C7', description: 'Исходящий туннель I2P — garlic routing', type: 'node' },
  { id: 'i2p-inbound', label: 'I2P Inbound', x: 590, y: 300, color: '#0284C7', description: 'Входящий туннель I2P — получает данные от eepsite', type: 'node' },
  { id: 'onion-ip', label: 'Intro Point', x: 590, y: 200, color: '#DC2626', description: 'Introduction Point — точка представления Onion-сервиса', type: 'node' },
  { id: 'onion-rp', label: 'Rendezvous', x: 420, y: 200, color: '#DC2626', description: 'Rendezvous Point — точка встречи клиента и Onion-сервиса', type: 'node' },
  { id: 'clearnet', label: 'Clearnet', x: 760, y: 100, color: '#6B7280', description: 'Обычный интернет — доступен через Exit-узлы Tor', type: 'network' },
  { id: 'eepsite', label: 'Eepsite', x: 760, y: 300, color: '#0284C7', description: 'Внутренний I2P-сайт — доступен только через I2P', type: 'network' },
  { id: 'onion-service', label: 'Onion Service', x: 760, y: 200, color: '#DC2626', description: '.onion-сервис — анонимный сервер через Tor', type: 'network' },
];

const links: NetworkLink[] = [
  { from: 'client', to: 'tor-guard', label: 'Encrypted', animated: true },
  { from: 'tor-guard', to: 'tor-middle', animated: true },
  { from: 'tor-middle', to: 'tor-exit', animated: true },
  { from: 'tor-exit', to: 'clearnet' },
  { from: 'client', to: 'socks5', label: 'SOCKS5h' },
  { from: 'socks5', to: 'tor-guard', label: '→ Tor' },
  { from: 'client', to: 'i2p-outbound', label: 'Garlic' },
  { from: 'i2p-outbound', to: 'i2p-inbound', animated: true },
  { from: 'i2p-inbound', to: 'eepsite' },
  { from: 'tor-middle', to: 'onion-rp', label: 'Rendezvous' },
  { from: 'onion-rp', to: 'onion-ip' },
  { from: 'onion-ip', to: 'onion-service' },
];

export function NetworkMap() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-emerald-400">🗺️ Сетевая карта инфраструктуры</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox="0 0 860 400"
            className="w-full min-w-[300px] sm:min-w-[600px] h-auto"
            style={{ maxHeight: '500px' }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="860" height="400" fill="url(#grid)"/>

            {/* Links */}
            {links.map((link, i) => {
              const from = nodes.find(n => n.id === link.from);
              const to = nodes.find(n => n.id === link.to);
              if (!from || !to) return null;

              const isHighlighted = hoveredNode === link.from || hoveredNode === link.to;

              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? from.color : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={link.animated ? '6,4' : undefined}
                  />
                  {link.label && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 8}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.4)"
                      fontSize="10"
                    >
                      {link.label}
                    </text>
                  )}
                  {link.animated && (
                    <circle r="3" fill={from.color} filter="url(#glow)">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M${from.x},${from.y} L${to.x},${to.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;
              const size = node.type === 'network' ? 28 : node.type === 'client' ? 24 : 20;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    fill={`${node.color}${isSelected ? '40' : '20'}`}
                    stroke={node.color}
                    strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                    filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={node.type === 'network' ? 9 : 8}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(20, 360)">
              <circle cx="0" cy="0" r="5" fill="#7C3AED" />
              <text x="10" y="4" fill="#7C3AED" fontSize="10">Tor</text>
              <circle cx="60" cy="0" r="5" fill="#059669" />
              <text x="70" y="4" fill="#059669" fontSize="10">SOCKS5</text>
              <circle cx="140" cy="0" r="5" fill="#0284C7" />
              <text x="150" y="4" fill="#0284C7" fontSize="10">I2P</text>
              <circle cx="190" cy="0" r="5" fill="#DC2626" />
              <text x="200" y="4" fill="#DC2626" fontSize="10">Onion</text>
              <circle cx="260" cy="0" r="5" fill="#6B7280" />
              <text x="270" y="4" fill="#6B7280" fontSize="10">Clearnet</text>
            </g>
          </svg>
        </div>

        {selectedNode && (
          <div className="mt-4 p-3 rounded-lg border border-border bg-card/50 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }} />
              <h4 className="font-semibold text-sm">{selectedNode.label}</h4>
              <Badge variant="outline" className="text-xs" style={{ borderColor: selectedNode.color, color: selectedNode.color }}>
                {selectedNode.type === 'network' ? 'Сеть' : selectedNode.type === 'client' ? 'Клиент' : 'Узел'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
