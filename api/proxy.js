export default async function handler(req, res) {
  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Тестовый GET — просто проверить, что прокси жив
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Proxy is running' });
  }

  // POST — проксируем в OpenRouter
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || ''
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(502).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
