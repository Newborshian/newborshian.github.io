// Fonction Vercel : répond aux questions des visiteurs sur le parcours, à partir du CV uniquement.
// Variables d'environnement (à définir dans Vercel) :
//   ANTHROPIC_API_KEY         clé dédiée à ce site, avec une limite de dépense côté Anthropic
//   ALLOWED_ORIGIN            adresse du site, par exemple https://cv-christopher-bouthemy.vercel.app
//   UPSTASH_REDIS_REST_URL    compteurs des quotas (intégration Upstash Redis de Vercel)
//   UPSTASH_REDIS_REST_TOKEN
//   CLAUDE_MODEL              facultatif, modèle à utiliser (claude-haiku-5-5 par défaut)

import { createHash } from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { cv } from '../src/data/cv';

const MAX_QUESTION_LENGTH = 500;
const DAILY_LIMIT_PER_VISITOR = 5;
const DAILY_LIMIT_TOTAL = 20;
const COUNTER_TTL_SECONDS = 2 * 24 * 60 * 60;

const SYSTEM_PROMPT = `Tu es l'assistant du CV en ligne de ${cv.name}. Tu réponds aux questions des recruteurs et visiteurs sur son parcours.

Règles :
- Réponds uniquement à partir du CV ci-dessous. Si l'information n'y figure pas, dis que tu ne sais pas et invite à le contacter par e-mail.
- N'invente jamais de diplôme, de poste, de date, de chiffre ou de compétence.
- Réponds en français, en 3 à 5 phrases au plus, en texte simple sans mise en forme.
- Parle de ${cv.name} à la troisième personne.
- Refuse poliment toute demande sans rapport avec son parcours professionnel.

CV (JSON) :
${JSON.stringify(cv)}`;

let client: Anthropic | undefined;
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : undefined;

// Sans Redis (développement local), compteurs en mémoire : propres à chaque instance, donc approximatifs.
const memoryCounters = new Map<string, number>();

async function increment(key: string): Promise<number> {
  if (!redis) {
    const value = (memoryCounters.get(key) ?? 0) + 1;
    memoryCounters.set(key, value);
    return value;
  }
  const value = await redis.incr(key);
  if (value === 1) await redis.expire(key, COUNTER_TTL_SECONDS);
  return value;
}

/** Consomme une question du quota du jour (heure de Paris). Renvoie un message d'erreur si le quota est atteint. */
async function consumeQuota(ip: string): Promise<string | undefined> {
  const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  // L'adresse IP n'est jamais stockée en clair.
  const visitor = createHash('sha256').update(ip).digest('hex').slice(0, 32);

  if ((await increment(`ask:visitor:${visitor}:${day}`)) > DAILY_LIMIT_PER_VISITOR) {
    return `Vous avez atteint la limite de ${DAILY_LIMIT_PER_VISITOR} questions par jour. Pour aller plus loin, contactez-le par e-mail.`;
  }
  if ((await increment(`ask:total:${day}`)) > DAILY_LIMIT_TOTAL) {
    return "L'assistant a atteint sa limite de questions pour aujourd'hui. Réessayez demain ou contactez-le par e-mail.";
  }
  return undefined;
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin');
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (!allowedOrigin || origin !== allowedOrigin) {
    return json({ error: 'Origine non autorisée.' }, 403, null);
  }

  let question: unknown;
  try {
    ({ question } = (await request.json()) as { question?: unknown });
  } catch {
    return json({ error: 'Requête invalide.' }, 400, origin);
  }
  if (typeof question !== 'string' || !question.trim() || question.length > MAX_QUESTION_LENGTH) {
    return json({ error: `La question doit faire entre 1 et ${MAX_QUESTION_LENGTH} caractères.` }, 400, origin);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue';
  let quotaError: string | undefined;
  try {
    quotaError = await consumeQuota(ip);
  } catch (error) {
    // Compteurs injoignables : on refuse plutôt que de dépasser le budget.
    console.error('Erreur des compteurs de quota', error);
    return json({ error: "L'assistant est indisponible pour le moment." }, 503, origin);
  }
  if (quotaError) {
    return json({ error: quotaError }, 429, origin);
  }

  try {
    client ??= new Anthropic();
    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL ?? 'claude-haiku-5-5',
      max_tokens: 2048,
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: question.trim() }],
    });

    if (response.stop_reason === 'refusal') {
      return json({ answer: 'Je ne peux pas répondre à cette question. Pour toute demande, contactez-le par e-mail.' }, 200, origin);
    }
    const answer = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();
    return json({ answer: answer || "Je n'ai pas de réponse à cette question." }, 200, origin);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: "L'assistant est très sollicité. Réessayez dans un instant." }, 503, origin);
    }
    console.error('Erreur API Claude', error instanceof Anthropic.APIError ? error.status : error);
    return json({ error: "L'assistant est indisponible pour le moment." }, 502, origin);
  }
}
