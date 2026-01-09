import { NextResponse } from 'next/server';
//import { Pool } from 'pg';
import pool from '@/lib/db';

//const pool = new Pool({
  //connectionString: process.env.DATABASE_URL,
//});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const query = 'DELETE FROM subscribers WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}