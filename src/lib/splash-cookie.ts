// Shared between the blocking inline script in the root layout (which must
// run synchronously before first paint — see FIX-AND-POLISH-V1 §1) and
// SplashScreen.tsx itself, so the two can't drift out of sync.
export const SPLASH_COOKIE_NAME = 'miqyas_first_light';
export const SPLASH_COOKIE_MAX_AGE_S = 1800; // ~30 minutes, approximates "this session"
export const SPLASH_SKIP_ATTR = 'data-splash-skip';
