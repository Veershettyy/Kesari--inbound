const { Mistral } = require('@mistralai/mistralai');

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const LANGUAGES = {
  es:'Spanish', fr:'French', hi:'Hindi', de:'German', ja:'Japanese',
  pt:'Portuguese', it:'Italian', zh:'Chinese Simplified', ar:'Arabic',
  ko:'Korean', ml:'Malayalam', pl:'Polish',
};

async function translatePackageName(englishName, langCode) {
  const langName = LANGUAGES[langCode];
  if (!langName) return englishName;

  const res = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [{
      role: 'user',
      content: `Translate this India tour package name from English to ${langName}.
Keep place names as-is (Rajasthan, Kerala, Goa, etc). Translate descriptive words.
Return ONLY the translated name, nothing else.

"${englishName}"`,
    }],
  });

  return res.choices[0].message.content.trim().replace(/^"|"$/g, '');
}

async function translateAllLanguages(englishName) {
  const results = { en: englishName };
  await Promise.all(
    Object.keys(LANGUAGES).map(async (code) => {
      try {
        results[code] = await translatePackageName(englishName, code);
      } catch {
        results[code] = englishName; // fallback to English
      }
    })
  );
  return results;
}

module.exports = { translateAllLanguages, translatePackageName };
