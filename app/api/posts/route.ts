import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  console.log('Received POST request with body:', body);
  const { title, content, slug, featuredImageUrl, category, status} = body;
  const categoryValue = category || 'General';

  const now = new Date();
  const formatted: string = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  try {
    // 1. Check if slug exists
    const checkSlug = await pool.query('SELECT slug FROM posts WHERE slug = $1', [slug]);

    let finalSlug = slug;
    if (checkSlug.rows.length > 0) {
      // 2. If it exists, append a timestamp or random string to make it unique
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // 3. Insert into PostgreSQL
    const newPost = await pool.query(
      'INSERT INTO posts (title, content, slug, status, featured_image_url, category, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, content, finalSlug, status, featuredImageUrl, categoryValue, formatted]
    );

    return NextResponse.json(newPost.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}