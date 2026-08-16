// instrumentation.ts — place in your project root (or src/)
import patchflow from './patchflow';

export function register() {
  patchflow.init({
    apiKey: 'pf_live_d475bc09656b1ee3ad0f6369a4c502deb66b1f0df8cbe51784e70b9e5c4f9042'
  });
}
// That's it! Every route, API handler, and server action is now monitored.
