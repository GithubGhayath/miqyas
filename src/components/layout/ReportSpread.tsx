import type { ReactNode } from 'react';

export function ReportSpread({ facts, children }: { facts: ReactNode; children: ReactNode }) {
  return (
    <div className="report-spread">
      <div className="report-spread__facts">{facts}</div>
      <div className="report-spread__prose">{children}</div>
    </div>
  );
}

export function ReportFact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="report-spread__fact">
      <span className="report-spread__fact-label">{label}</span>
      <span className="report-spread__fact-value">{value}</span>
    </div>
  );
}
