import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  IBM_Plex_Sans_Condensed,
  Noto_Kufi_Arabic,
} from 'next/font/google';

export const displayAr = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['500', '600', '700'],
  variable: '--font-display-ar',
  display: 'swap',
});

export const displayEn = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display-en',
  display: 'swap',
});

export const textAr = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-text-ar',
  display: 'swap',
  preload: false,
});

export const textEn = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-text-en',
  display: 'swap',
  preload: false,
});

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

export const fontVariables = [
  displayAr.variable,
  displayEn.variable,
  textAr.variable,
  textEn.variable,
  mono.variable,
].join(' ');
