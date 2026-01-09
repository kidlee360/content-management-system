// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';
//import { Pool } from 'pg';
import pool from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

//const pool = new Pool({
  //connectionString: process.env.DATABASE_URL, // Ensure this is in your .env
//});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Insert into your 'subscribers' table
    const query = `
      INSERT INTO subscribers (email) 
      VALUES ($1) 
      ON CONFLICT (email) DO NOTHING 
      RETURNING *;
    `;
    
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }
    await resend.emails.send({
      from: 'System <onboarding@resend.dev>',
      to: 'YOUR_PERSONAL_EMAIL@gmail.com',
      subject: 'New Subscriber! 🎉',
      html: `<p>New user just joined: <strong>${email}</strong></p>`
    });

    return NextResponse.json({ message: 'Success' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}