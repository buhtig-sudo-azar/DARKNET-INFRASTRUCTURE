// OpenRouter AI Chat API route with SSE streaming
import { NextRequest } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages, searchContext, topicContext } = await req.json();

    const basePrompt = `Ты — эксперт по сетевой инфраструктуре Dark/Deep Web. Отвечай на русском языке.
Специализации: Tor (The Onion Router), SOCKS5-прокси, I2P (Invisible Internet Project), Onion-сервисы, сетевая безопасность, анонимность, криптография.
Образовательный контекст: давай подробные объяснения с примерами, терминами и ссылками на RFC/стандарты.
Если вопрос не связан с темой Dark/Deep Web инфраструктуры, вежливо перенаправь пользователя на соответствующие разделы.
Всегда объясняй технические термины простым языком. Приводи примеры конфигураций когда уместно.`;

    const topicPart = topicContext ? `\n\nСейчас пользователь изучает раздел: ${topicContext}. Отвечай в контексте этой темы. Если вопрос относится к другой теме, коротко ответь, но порекомендуй перейти в соответствующий раздел для более детального изучения.` : '';
    const searchPart = searchContext ? `\n\nКонтекст из поиска:\n${searchContext}` : '';

    const systemPrompt = basePrompt + topicPart + searchPart;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://dark-psi.vercel.app/',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
      }),
      signal: AbortSignal.timeout(55000),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', response.status, errText);
      return new Response(JSON.stringify({ error: `OpenRouter API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;
              const data = trimmed.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
