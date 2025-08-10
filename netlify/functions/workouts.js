const DEFAULT_API_URL = 'https://jsonplaceholder.typicode.com/todos';
exports.handler = async (event, context) => {
  try {
    const { API_URL = DEFAULT_API_URL, API_KEY } = process.env;
    const params = new URLSearchParams(event.queryStringParameters || {});
    const limit = params.get('limit') || '5';
    const url = `${API_URL}?_limit=${encodeURIComponent(limit)}`;
    const headers = {};
    if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) return { statusCode: resp.status, body: await resp.text() };
    return { statusCode: 200, headers: {'content-type':'application/json'}, body: await resp.text() };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};