// Real load-progress tracking for the splash screen — UI-OVERHAUL-V4 §6.3.
// Resolves against actual critical assets (fonts + first-viewport images),
// not a fixed timer. `onStep` fires once per resolved asset so the caller
// can drive a smoothed visual value between the discrete jumps.
export async function trackCriticalAssets(onStep?: () => void): Promise<void> {
  const criticalImages = Array.from(
    document.querySelectorAll<HTMLImageElement>('img[data-critical="true"]'),
  );

  const steps: Promise<void>[] = [
    document.fonts.ready.then(() => undefined),
    ...criticalImages.map((img) =>
      (img.complete ? Promise.resolve() : img.decode().catch(() => undefined)).then(() => undefined),
    ),
  ];

  if (steps.length === 1) {
    // No first-viewport images flagged on this route — fall back to the
    // window load event so there's still a second real signal to track.
    steps.push(
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      }),
    );
  }

  await Promise.all(steps.map((step) => step.then(() => onStep?.())));
}
