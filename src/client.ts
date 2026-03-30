const BASE_URL = "https://api.superjob.ru/2.0";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export async function sjGet(path: string): Promise<unknown> {
  const apiKey = process.env.SUPERJOB_API_KEY;
  if (!apiKey) {
    throw new Error("SUPERJOB_API_KEY обязателен. Получите на api.superjob.ru");
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
          "X-Api-App-Id": apiKey,
          "Accept": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw new Error(`SuperJob HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) continue;
      throw error;
    }
  }
  throw new Error("SuperJob: все попытки исчерпаны");
}
