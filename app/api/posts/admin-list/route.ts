import { NextResponse } from 'next/server';
//import { Pool } from 'pg';
import pool from '@/lib/db';

//const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
//});

export async function GET() {
  try {
    // We select id, title, slug, status, and views for the dashboard table
    // Ordering by created_at DESC ensures your latest work is always at the top
    const query = `
      SELECT id, title, slug, status, views, created_at 
      FROM posts 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Admin List Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin posts' }, { status: 500 });
  }
}