const SPIKE_EVENT = 'miqyas:instrument-spike';

export interface InstrumentSpikeDetail {
  intensity: number;
}

/**
 * FIX-AND-POLISH-V3 §5.3 — the instrument trace is one fixed element with
 * no knowledge of the components that should make it react. Rather than
 * threading a ref or a context provider through three unrelated parts of
 * the tree (a condition-scale panel, the section-focus system, the work
 * conveyor), each of those calls this at its own existing "something just
 * resolved" moment, and the trace itself is the only listener.
 */
export function spikeInstrumentTrace(intensity = 1) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<InstrumentSpikeDetail>(SPIKE_EVENT, { detail: { intensity } }));
}

export function onInstrumentSpike(handler: (intensity: number) => void): () => void {
  function listener(event: Event) {
    const detail = (event as CustomEvent<InstrumentSpikeDetail>).detail;
    handler(detail?.intensity ?? 1);
  }
  window.addEventListener(SPIKE_EVENT, listener);
  return () => window.removeEventListener(SPIKE_EVENT, listener);
}
