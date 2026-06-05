// Step-by-step guide component
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { Check, ChevronRight } from 'lucide-react';

interface Step {
  title: string;
  command: string;
  description: string;
}

interface StepGuideProps {
  title: string;
  steps: Step[];
  accentColor: string;
}

export function StepGuide({ title, steps, accentColor }: StepGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle style={{ color: accentColor }}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 transition-all ${
              completedSteps.has(i)
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-border bg-card/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(i)}
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  completedSteps.has(i)
                    ? 'border-green-500 bg-green-500'
                    : 'border-muted-foreground/30'
                }`}
              >
                {completedSteps.has(i) ? (
                  <Check className="h-3.5 w-3.5 text-white" />
                ) : (
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                <CodeBlock code={step.command} language="bash" />
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedSteps.size / steps.length) * 100}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          <span>{completedSteps.size}/{steps.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
