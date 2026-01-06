import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parameter = searchParams.get('slug');
    const slug = parameter;
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const result = await pool.query('SELECT * FROM posts WHERE slug = $1 LIMIT 1', [slug]);
    if (!result.rows || result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}