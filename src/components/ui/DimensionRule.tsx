export function DimensionRule({ label }: { label?: string }) {
  return (
    <div className="dimension-rule" role={label ? undefined : 'separator'} aria-hidden={label ? undefined : true}>
      <span className="dimension-rule__tick" aria-hidden="true" />
      <span className="dimension-rule__line" aria-hidden="true" />
      {label ? <span className="dimension-rule__label">{label}</span> : null}
      <span className="dimension-rule__line" aria-hidden="true" />
      <span className="dimension-rule__tick" aria-hidden="true" />
    </div>
  );
}
