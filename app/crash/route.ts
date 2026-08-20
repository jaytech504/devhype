import { NextResponse } from 'next/server';
import patchflow from '@/patchflow'; // or '../patchflow'

export const dynamic = 'force-dynamic';

export const GET = patchflow.wrapNextHandler(async () => {
  try {
    const data: any = undefined;
    // Added optional chaining to prevent TypeError if data or notes are missing
    const title = data?.notes?.title;

    if (title === undefined) {
      return NextResponse.json({ error: 'Required data field "notes.title" is missing' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, title });
  } catch (error) {
    console.error('[GET /crash] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});