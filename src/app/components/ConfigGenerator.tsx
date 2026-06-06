// Config generator component with form inputs and preview
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { Loader2 } from 'lucide-react';

interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue: string | number | boolean;
}

interface ConfigGeneratorProps {
  title: string;
  description: string;
  fields: ConfigField[];
  apiEndpoint: string;
  apiType: string;
  accentColor: string;
}

export function ConfigGenerator({ title, description, fields, apiEndpoint, apiType, accentColor }: ConfigGeneratorProps) {
  const [config, setConfig] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {};
    fields.forEach(f => { initial[f.key] = f.defaultValue; });
    return initial;
  });
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const updateConfig = (key: string, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: apiType, config }),
      });
      const data = await res.json();
      if (data.config) {
        setGeneratedConfig(data.config);
      }
    } catch (err) {
      console.error('Config generation error:', err);
      setGeneratedConfig('# Ошибка генерации конфигурации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle style={{ color: accentColor }}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key} className="text-sm text-muted-foreground">
                {field.label}
              </Label>
              {field.type === 'select' && field.options ? (
                <Select
                  value={String(config[field.key])}
                  onValueChange={val => updateConfig(field.key, val)}
                >
                  <SelectTrigger id={field.key}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'boolean' ? (
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    id={field.key}
                    checked={Boolean(config[field.key])}
                    onCheckedChange={val => updateConfig(field.key, val)}
                  />
                  <span className="text-sm">{config[field.key] ? 'Да' : 'Нет'}</span>
                </div>
              ) : (
                <Input
                  id={field.key}
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={String(config[field.key])}
                  onChange={e => updateConfig(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                  placeholder={field.placeholder}
                  className="h-9"
                />
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full min-h-[44px] text-sm sm:text-base"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Генерация...
            </>
          ) : (
            'Сгенерировать конфигурацию'
          )}
        </Button>

        {generatedConfig && (
          <CodeBlock code={generatedConfig} language="ini" title="Сгенерированная конфигурация" />
        )}
      </CardContent>
    </Card>
  );
}
