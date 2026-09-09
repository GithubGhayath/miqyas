const letters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));

export function SheetMargin() {
  return (
    <div className="sheet-margin no-print" aria-hidden="true">
      {letters.map((letter) => (
        <span key={letter}>{letter}</span>
      ))}
    </div>
  );
}
