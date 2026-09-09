export function Measure({ value, unit }: { value: string | number; unit?: string }) {
  return (
    <span dir="ltr" className="font-mono tabular-nums whitespace-nowrap">
      {value}
      {unit ? <span className="ms-[0.15em]">{unit}</span> : null}
    </span>
  );
}
