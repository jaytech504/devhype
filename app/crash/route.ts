import { NextResponse } from 'next/server';
import patchflow from '@/patchflow'; // or '../patchflow'

export const dynamic = 'force-dynamic';

export const GET = patchflow.wrapNextHandler(async () => {
  const data: any = undefined;
  const title = data.notes.title; // Throws TypeError

  return NextResponse.json({ ok: true });
});
