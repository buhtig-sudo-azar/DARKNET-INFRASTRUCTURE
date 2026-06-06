// Floating chat expert bubble — appears next to each topic section
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2, Trash2, MessageCircle, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FloatingChatExpertProps {
  topic: string;
  accentColor: string;
  icon: string;
  systemContext: string;
  suggestedQuestions: string[];
}

export function FloatingChatExpert({ topic, accentColor, icon, systemContext, suggestedQuestions }: FloatingChatExpertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || streaming) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          topicContext: systemContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API error');
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.content) {
              assistantContent += data.content;
              setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
            }
          } catch {
            // Skip malformed data
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Ошибка: не удалось получить ответ. Попробуйте ещё раз.' }]);
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-40 bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-fade-in-up"
          style={{ backgroundColor: accentColor, boxShadow: `0 4px 20px ${accentColor}60` }}
          title={`Спросить эксперта по ${topic}`}
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -left-1 text-lg">{icon}</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] sm:max-h-[600px] rounded-2xl border border-border bg-background shadow-2xl flex flex-col animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-border"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: accentColor }}>
                  Эксперт по {topic}
                </h3>
                <p className="text-[10px] text-muted-foreground">Спрашивайте, если что-то непонятно</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors"
                title="Очистить чат"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors"
                title="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[200px] max-h-[50vh] sm:max-h-[400px]"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Bot className="h-6 w-6" style={{ color: accentColor }} />
                </div>
                <p className="text-xs text-muted-foreground text-center px-2">
                  Задайте вопрос по теме «{topic}»
                </p>
                <div className="flex flex-col gap-1.5 w-full">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="text-xs text-left py-1.5 px-2.5 rounded-lg border transition-colors hover:bg-muted/30"
                      style={{ borderColor: `${accentColor}30`, color: `${accentColor}CC` }}
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Bot className="h-3.5 w-3.5" style={{ color: accentColor }} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-card border border-border'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: `${accentColor}40` } : {}}
                >
                  <div className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                )}
              </div>
            ))}

            {streaming && (
              <div className="flex gap-2 items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Bot className="h-3.5 w-3.5" style={{ color: accentColor }} />
                </div>
                <div className="bg-card border border-border rounded-xl px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: accentColor }} />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-border">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Спросите про ${topic}...`}
              disabled={streaming}
              className="flex-1 h-9 text-sm"
            />
            <Button
              type="submit"
              disabled={streaming || !input.trim()}
              className="h-9 w-9 p-0"
              style={{ backgroundColor: accentColor }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
