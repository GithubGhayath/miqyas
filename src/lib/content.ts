// src/lib/content.ts
// ─────────────────────────────────────────────────────────────
// BACKEND SEAM
// Every function below currently returns local data from src/content/*.
// To attach a real backend, replace ONLY the bodies with fetch() calls.
// Do NOT change any signature. Do NOT add a locale parameter.
// ─────────────────────────────────────────────────────────────
import type {
  AssessmentTierRow,
  CaseStudy,
  ConditionGrade,
  ContactInput,
  ContactResult,
  FaqItem,
  FieldNote,
  MethodPhase,
  Service,
  SiteConfig,
  SurveyPin,
  TeamMember,
} from '@/content/types';
import { site } from '@/content/site';
import { services } from '@/content/services';
import { methodPhases } from '@/content/method';
import { conditionScale } from '@/content/conditionScale';
import { assessmentTiers } from '@/content/assessmentTiers';
import { caseStudies } from '@/content/caseStudies';
import { fieldNotes } from '@/content/fieldNotes';
import { team } from '@/content/team';
import { faq } from '@/content/faq';
import { surveyPins } from '@/content/surveyPins';

export async function getSite(): Promise<SiteConfig> {
  return site;
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getService(slug: string): Promise<Service | null> {
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getMethodPhases(): Promise<MethodPhase[]> {
  return methodPhases;
}

export async function getConditionScale(): Promise<ConditionGrade[]> {
  return conditionScale;
}

export async function getAssessmentTiers(): Promise<AssessmentTierRow[]> {
  return assessmentTiers;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return caseStudies;
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  return caseStudies.find((c) => c.slug === slug) ?? null;
}

export async function getFieldNotes(): Promise<FieldNote[]> {
  return fieldNotes;
}

export async function getFieldNote(slug: string): Promise<FieldNote | null> {
  return fieldNotes.find((n) => n.slug === slug) ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  return team;
}

export async function getFaq(): Promise<FaqItem[]> {
  return faq;
}

export async function getSurveyPins(): Promise<SurveyPin[]> {
  return surveyPins;
}

export async function submitContactForm(input: ContactInput): Promise<ContactResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (input.email === 'error@example.com') {
    return { ok: false, error: 'network' };
  }
  return { ok: true, reference: 'REQ-' + Date.now().toString(36).toUpperCase() };
}
