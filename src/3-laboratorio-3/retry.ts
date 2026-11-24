export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  shouldRetry: (error: unknown) => boolean;
  random?: () => number;
}

export async function retry<T>(
  call: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const { maxAttempts, initialDelayMs, shouldRetry } = options;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError("maxAttempts must be a positive integer.");
  }
  if (!Number.isFinite(initialDelayMs) || initialDelayMs < 0) {
    throw new RangeError("initialDelayMs must be a non-negative number.");
  }

  const random = options.random ?? Math.random;
  const sleep = (milliseconds: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
  let delayCapMs = initialDelayMs;

  for (let attempt = 1; ; attempt += 1) {
    try {
      return await call();
    } catch (error) {
      if (!shouldRetry(error)) {
        throw error;
      }
      if (attempt >= maxAttempts) {
        console.log(
          `[retry] Operation failed after ${maxAttempts} attempts: ${error instanceof Error ? error.message : String(error)}`,
        );
        const reason =
          error instanceof Error && error.message
            ? error.message
            : String(error);
        throw new Error(
          `Operation failed after ${maxAttempts} attempts: ${reason.replace(/\s+/g, " ").trim()}`,
          { cause: error },
        );
      }

      await sleep(Math.floor(random() * delayCapMs));
      delayCapMs *= 2;
      console.log(
        `[retry] Retrying attempt ${attempt}/${maxAttempts}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
