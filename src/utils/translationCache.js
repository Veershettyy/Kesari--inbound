// Content hash — same algorithm as server side.
// When English JSON changes on redeploy, hash changes → both caches auto-invalidate.
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function cacheKey(namespace, langCode, content) {
  const hash = simpleHash(JSON.stringify(content));
  return `kesari_trans_${namespace}_${langCode}_${hash}`;
}

export function getCached(namespace, langCode, content) {
  try {
    const stored = localStorage.getItem(cacheKey(namespace, langCode, content));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setCached(namespace, langCode, content, translated) {
  try {
    localStorage.setItem(cacheKey(namespace, langCode, content), JSON.stringify(translated));
  } catch {
    // localStorage full — silently skip, server cache still works
  }
}

// Fetch a single namespace translation — localStorage first, then Netlify function
export async function fetchTranslation(namespace, englishContent, langCode) {
  const cached = getCached(namespace, langCode, englishContent);
  if (cached) return cached;

  const res = await fetch('/.netlify/functions/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ namespace, content: englishContent, targetLang: langCode }),
  });

  if (!res.ok) {
    throw new Error(`Translate function returned ${res.status}`);
  }

  const translated = await res.json();
  setCached(namespace, langCode, englishContent, translated);
  return translated;
}
