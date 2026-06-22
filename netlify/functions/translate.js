/**
 * How major companies handle dynamic translation:
 *
 * - Google: client-side DOM translation via widget — fast but unprofessional banner, no SEO benefit
 * - Netflix: pre-builds static JSON translation files per locale at deploy time — zero runtime cost
 *   but requires a human translator or CI pipeline for every new language
 * - Airbnb: SSR with translations loaded per route from a translation service — requires a Node server
 * - Booking.com: URL-based locale (booking.com/en-us vs booking.com/fr) with CDN-cached translated pages
 *   — best SEO, requires pre-translated content in database
 *
 * This implementation takes a hybrid approach suited for a Netlify static site with no backend server:
 * - Pre-built JSON for known languages (en, es-ES) — zero cost, instant load
 * - On-demand Claude API translation for any other language — called once per language per deploy
 * - Two-layer cache (localStorage + server in-memory) means Claude is called at most once per language
 *   per Netlify function instance, making it behave like Netflix's pre-built approach after first load
 */

const Anthropic = require('@anthropic-ai/sdk');

// In-memory server-side cache — persists within the same Lambda warm instance.
// First user per language triggers the Claude call; all subsequent users get instant cached result.
const serverCache = new Map();

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const { namespace, content, targetLang } = body;

  if (!namespace || !content || !targetLang) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing namespace, content, or targetLang' }),
    };
  }

  const contentStr = JSON.stringify(content);
  const contentHash = simpleHash(contentStr);
  const cacheKey = `${namespace}_${targetLang}_${contentHash}`;

  // Server-side cache hit — return immediately, no Claude call
  if (serverCache.has(cacheKey)) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      body: JSON.stringify(serverCache.get(cacheKey)),
    };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured in Netlify environment variables' }),
    };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a professional travel website translator. Translate the JSON values below from English to ${targetLang}.

Rules:
- Translate ONLY the values, NEVER the keys
- Preserve {variable} and {{variable}} placeholders exactly as-is (e.g. {{days}}, {{nights}})
- Preserve proper nouns: India, KESARi, Kesari, place names (Rajasthan, Kerala, Goa, Varanasi, Mumbai, Delhi, etc.), package codes (INBOUND-01, FIT-INBOUND-01, etc.)
- Return ONLY valid JSON — absolutely no markdown, no code fences, no explanation text before or after
- Keep the exact same nested structure as the input JSON

Input JSON:
${contentStr}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text.trim();
    const translated = JSON.parse(responseText);

    // Store in server-side cache — content hash ensures auto-invalidation on redeploy
    serverCache.set(cacheKey, translated);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      body: JSON.stringify(translated),
    };
  } catch (err) {
    console.error('Translation error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Translation failed', details: err.message }),
    };
  }
};
