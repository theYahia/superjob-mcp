const BASE_URL = "https://api.superjob.ru/2.0";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

function getCredentials() {
  // Support both old SUPERJOB_API_KEY and new SUPERJOB_SECRET_KEY + SUPERJOB_APP_ID
  const secretKey = process.env.SUPERJOB_SECRET_KEY ?? process.env.SUPERJOB_API_KEY;
  const appId = process.env.SUPERJOB_APP_ID;

  if (!secretKey) {
    throw new Error(
      "SUPERJOB_SECRET_KEY обязателен (или SUPERJOB_API_KEY). Получите на api.superjob.ru"
    );
  }

  return { secretKey, appId };
}

export async function sjGet(path: string): Promise<unknown> {
  const { secretKey, appId } = getCredentials();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const headers: Record<string, string> = {
        "X-Api-App-Id": secretKey,
        Accept: "application/json",
      };
      if (appId) {
        headers["X-Api-App-Secret"] = appId;
      }

      const response = await fetch(`${BASE_URL}${path}`, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if (
        (response.status === 429 || response.status >= 500) &&
        attempt < MAX_RETRIES
      ) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw new Error(`SuperJob HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (
        error instanceof DOMException &&
        error.name === "AbortError" &&
        attempt < MAX_RETRIES
      )
        continue;
      throw error;
    }
  }
  throw new Error("SuperJob: все попытки исчерпаны");
}
