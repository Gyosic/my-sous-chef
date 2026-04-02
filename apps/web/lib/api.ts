const handleError = async (res: Response) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message);
  }
};

export const actionFetch = async (
  url: string | URL | Request,
  options: RequestInit,
) => {
  try {
    const res = await fetch(url, options);

    await handleError(res);

    const data = await res.json();

    return data;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};
