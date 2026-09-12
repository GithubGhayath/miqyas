// src/content/types.ts
export type Locale = 'ar' | 'en';
export type Localized = { ar: string; en: string };
export type LocalizedRich = { ar: string[]; en: string[] }; // array = paragraphs

export interface ImageRef {
  src: string; // absolute URL for now
  alt: Localized;
  width: number;
  height: number;
  credit?: string;
}

export type Grade = 1 | 2 | 3 | 4 | 5;

export interface ConditionGrade {
  id: string;
  grade: Grade;
  name: Localized;
  meaning: Localized;
  action: Localized;
  image: ImageRef;
}

export interface Service {
  id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  whatItIs: LocalizedRich;
  whoAsks: Localized;
  youReceive: Localized[]; // list items
  duration: Localized;
}

export type DocImportance = 'critical' | 'core' | 'supporting';

export interface MethodDeliverable {
  id: string;
  name: Localized;
  importance: DocImportance;
}

export interface MethodPhase {
  id: string;
  order: 1 | 2 | 3 | 4 | 5;
  name: Localized;
  nameEn: string; // e.g. "Sourcing" — shown as a technical term in both locales
  whatHappens: LocalizedRich;
  clientRole: Localized;
  deliverables: MethodDeliverable[];
  durationDays: [number, number];
}

export interface AssessmentTierRow {
  id: string;
  aspect: Localized;
  preliminary: Localized;
  full: Localized;
}

export interface EquipmentRow {
  id: string;
  name: Localized;
  make?: string;
  rating?: string; // e.g. "380 kW"
  yearInstalled?: number;
  grade: Grade;
  note: Localized;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: Localized;
  sector: Localized;
  governorate: Localized; // governorate level only — never a precise address
  year: number;
  status: 'pilot' | 'delivered';
  brief: LocalizedRich;
  findings: LocalizedRich;
  decisionEnabled: LocalizedRich;
  // FIX-AND-POLISH-V2 §3.4 — one sentence distinct from `findings` and
  // `decisionEnabled`: the single takeaway a report like this exists to
  // establish, e.g. "Proved the line's shutdown was a power problem, not a
  // machine problem." Real content the report needs, not filler.
  whatThisProves: Localized;
  equipment: EquipmentRow[];
  cover: ImageRef;
  beforeAfter?: { before: ImageRef; after: ImageRef };
  gallery: ImageRef[];
}

export interface FieldNoteFigure {
  after: number;
  image: ImageRef;
  caption: Localized;
}

export interface FieldNote {
  id: string;
  slug: string;
  title: Localized;
  standfirst: Localized;
  publishedAt: string; // ISO 8601
  readingMinutes: number;
  body: LocalizedRich;
  figures?: FieldNoteFigure[];
  cover: ImageRef;
}

export interface TeamMember {
  id: string;
  name: Localized;
  role: Localized;
  contribution: Localized;
  portrait: ImageRef;
}

export interface FaqItem {
  id: string;
  question: Localized;
  answer: LocalizedRich;
}

export interface SiteConfig {
  name: Localized;
  tagline: Localized;
  location: Localized;
  timezone: string;
  email: string;
  responseTimeHours: number;
  workingHours: Localized;
  languages: Localized;
}

export interface SurveyPin {
  id: string;
  xPct: number;
  yPct: number;
  equipment: Localized;
  grade: Grade;
  measure: { value: string | number; unit?: string };
  observation: Localized;
  hideOnMobile?: boolean;
}

export interface ContactInput {
  name: string;
  email: string;
  organisation?: string;
  country?: string;
  facilityLocation?: string;
  facilityType: 'factory' | 'line' | 'warehouse' | 'machine' | 'other';
  message: string;
  preferredContact: 'email' | 'whatsapp' | 'call';
}

export type ContactResult =
  | { ok: true; reference: string }
  | { ok: false; error: 'network' | 'validation' | 'unknown' };
