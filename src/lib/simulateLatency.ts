export function simulateLatency<T>(produce: () => T, minMs = 700, maxMs = 1400): Promise<T> {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => {
    setTimeout(() => resolve(produce()), delay);
  });
}
