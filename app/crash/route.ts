import { NextResponse } from 'next/server';

export async function GET() {
  const data: any = undefined;
  const title = data.notes.title; // Throws TypeError
  return NextResponse.json({ ok: true });
}
