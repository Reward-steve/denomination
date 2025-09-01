export function retry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> {
  return fn().catch((err) => {
    if (retries <= 0) throw err;
    return new Promise((res) => setTimeout(res, delay)).then(() =>
      retry(fn, retries - 1, delay)
    );
  });
}
