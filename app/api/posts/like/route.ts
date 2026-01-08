// app/api/posts/like/route.ts
import { NextResponse } from 'next/server';
//import { Pool } from 'pg';
import pool from '@/lib/db';

//const pool = new Pool({
  //connectionString: process.env.DATABASE_URL,
//});

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Missing Post ID' }, { status: 400 });
    }

    // Atomic increment: Add 1 to the existing likes count
    const query = `
      UPDATE posts 
      SET likes = COALESCE(likes, 0) + 1 
      WHERE id = $1 
      RETURNING likes;
    `;
    
    const result = await pool.query(query, [postId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ likes: result.rows[0].likes }, { status: 200 });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}