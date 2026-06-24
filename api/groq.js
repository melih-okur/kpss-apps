export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://your-vercel-app-url.vercel.app', // Vercel uygulamanızın URL'si ile değiştirin
          'X-Title': 'KPSS Soru Üretici Backend'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat', // DeepSeek'in en güncel ve kaliteli modeli
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.95
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // OpenRouter'dan gelen hata mesajını daha detaylı ilet
      const errorDetail = data.error ? data.error.message : 'Bilinmeyen OpenRouter API hatası';
      return res.status(response.status).json({ error: `OpenRouter API Hatası: ${errorDetail}` });
    }

    return res.status(200).json(data);

  } catch (e) {
    console.error("Backend API Hatası:", e);
    return res.status(500).json({
      error: e.message || 'Sunucu tarafında bir hata oluştu.'
    });
  }
}
