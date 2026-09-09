export interface TitleBlockCell {
  label: string;
  value: string;
}

export function TitleBlock({ cells }: { cells: TitleBlockCell[] }) {
  return (
    <div
      className="title-block"
      role="group"
      style={cells.length !== 4 ? { gridTemplateColumns: `repeat(${cells.length}, 1fr)` } : undefined}
    >
      {cells.map((cell) => (
        <div className="title-block__cell" key={cell.label}>
          <span className="title-block__label">{cell.label}</span>
          <span className="title-block__value" title={cell.value}>
            {cell.value}
          </span>
        </div>
      ))}
    </div>
  );
}
