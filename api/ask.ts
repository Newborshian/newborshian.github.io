// Fonction Vercel : répond aux questions des visiteurs sur le parcours, à partir du CV uniquement.
// Variables d'environnement (à définir dans Vercel) :
//   ANTHROPIC_API_KEY  clé dédiée à ce site, avec une limite de dépense côté Anthropic
//   ALLOWED_ORIGIN     adresse du site, par exemple https://cv-christopher-bouthemy.vercel.app
//   CLAUDE_MODEL       facultatif, modèle à utiliser (claude-opus-5-5 par défaut)

import Anthropic from '@anthropic-ai/sdk';
import { cv } from '../src/data/cv';

const MAX_QUESTION_LENGTH = 500;
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 10 };

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

// Limite par adresse IP, en mémoire : protection de base, propre à chaque instance de la fonction.
// La protection principale reste la limite de dépense de la clé et une règle de pare-feu Vercel.
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
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

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'inconnue';
  if (isRateLimited(ip)) {
    return json({ error: 'Trop de questions. Réessayez plus tard.' }, 429, origin);
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

  try {
    client ??= new Anthropic();
    const response = await client.beta.messages.create({
      model: process.env.CLAUDE_MODEL ?? 'claude-opus-5-5',
      max_tokens: 2048,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: question.trim() }],
    });

    if (response.stop_reason === 'refusal') {
      return json({ answer: "Je ne peux pas répondre à cette question. Pour toute demande, contactez-le par e-mail." }, 200, origin);
    }
    const answer = response.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
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
