import { NextResponse } from 'next/server';

// ⚡ Tell Next.js not to execute this during 'npm run build'
export const dynamic = 'force-dynamic';

export async function GET() {
  // This will now ONLY run at runtime when you visit the URL in your browser!
  const data: any = undefined;
  const title = data.notes.title; // Throws TypeError at runtime

  return NextResponse.json({ ok: true });
}

