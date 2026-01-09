import { NextResponse } from 'next/server';
//import { Pool } from 'pg';
import pool from '@/lib/db';

//const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
//});

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    // Atomic increment for views
    const query = `
      UPDATE posts 
      SET views = COALESCE(views, 0) + 1 
      WHERE slug = $1 
      RETURNING views;
    `;
    
    const result = await pool.query(query, [slug]);

    return NextResponse.json({ views: result.rows[0]?.views || 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}