// instrumentation.ts — place in project root (or src/)
import patchflow from './patchflow'; // or from '@/lib/patchflow'

export function register() {
  patchflow.init({
    apiKey: process.env.PATCHFLOW_API_KEY!
  });
}

// ⚡ Automatically intercepts all unhandled errors across all API routes & pages:
export async function onRequestError(err: any, request: any) {
  patchflow.captureException(err, {
    endpoint: request?.path || '',
    method: request?.method || 'GET',
    framework: 'nextjs',
  });
}