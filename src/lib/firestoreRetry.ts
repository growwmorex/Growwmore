export function isTransientFirestoreError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const value = message.toLowerCase();
  return (
    value.includes("database is closing") ||
    value.includes("database is hidden") ||
    value.includes("client is offline") ||
    value.includes("failed-precondition") ||
    value.includes("unavailable") ||
    value.includes("network") ||
    value.includes("indexeddb")
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForVisiblePage() {
  if (typeof document === "undefined" || document.visibilityState === "visible") return;
  await new Promise<void>(resolve => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", onVisible);
        resolve();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisible);
      resolve();
    }, 2500);
  });
}

export async function withFirestoreRetry<T>(
  action: () => Promise<T>,
  attempts = 4
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      if (attempt > 0) {
        await waitForVisiblePage();
        await sleep(250 * (attempt + 1));
      }
      return await action();
    } catch (error) {
      lastError = error;
      if (!isTransientFirestoreError(error) || attempt === attempts - 1) throw error;
    }
  }
  throw lastError;
}

export function friendlyFirestoreError(error: unknown) {
  if (isTransientFirestoreError(error)) {
    return "Your browser briefly paused the secure database connection. Return to this tab and try once more.";
  }
  return error instanceof Error ? error.message : "Could not reach the secure database.";
}
