import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parameter = {
      category: searchParams.get('category'),
      currentId: searchParams.get('currentId'),
    };
    const { category, currentId } = parameter;
    if (!category || !currentId) return NextResponse.json({ error: 'Missing category or currentId' }, { status: 400 });

    const relatedPosts = await pool.query('SELECT id, title, slug, created_at FROM posts WHERE category = $1 AND id != $2 LIMIT 3', [category, currentId]);
    if (!relatedPosts.rows || relatedPosts.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(relatedPosts.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}