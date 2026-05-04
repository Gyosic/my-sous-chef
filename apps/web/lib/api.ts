const handleError = async (res: Response, msg?: string) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(msg || message);
  }
};

export const actionFetch = async <T>(
  url: string | URL | Request,
  options?: RequestInit,
): Promise<T> => {
  try {
    const res = await fetch(url, options);

    await handleError(res);

    const data = await res.json();

    return data;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export const setLocalStorage = (key: string, value: unknown) => {
  console.info({ key, value });
  localStorage.setItem(key, JSON.stringify(value));

  return JSON.stringify(value);
};

export const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  if (!value) return;

  return JSON.parse(value);
};
