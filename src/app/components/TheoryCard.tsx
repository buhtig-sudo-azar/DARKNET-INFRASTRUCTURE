// Theory card component with accordion for expandable sections
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface TheorySection {
  id: string;
  title: string;
  content: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface TheoryCardProps {
  sections: TheorySection[];
  faq?: FAQItem[];
  accentColor?: string;
}

export function TheoryCard({ sections, faq, accentColor = '#7C3AED' }: TheoryCardProps) {
  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-2">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border border-border rounded-lg overflow-hidden bg-card/50"
          >
            <AccordionTrigger
              className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors"
              style={{ color: accentColor }}
            >
              <span className="text-left font-semibold">{section.title}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="prose prose-sm prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed text-sm mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {faq && faq.length > 0 && (
        <div className="mt-6">
          <Badge variant="outline" className="mb-3" style={{ borderColor: accentColor, color: accentColor }}>
            Часто задаваемые вопросы
          </Badge>
          <Accordion type="multiple" className="space-y-2">
            {faq.map((item, i) => (
              <AccordionItem
                key={`faq-${i}`}
                value={`faq-${i}`}
                className="border border-border rounded-lg overflow-hidden bg-card/30"
              >
                <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-muted/30 transition-colors text-sm">
                  <span className="text-left">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
