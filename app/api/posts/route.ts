import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);


export async function GET( req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const reportName = searchParams.get('reportName');
  if (reportName === 'publishedPosts') {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE status = $1 ORDER BY created_at DESC', ['published']);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
  } else {
    return NextResponse.json({ error: 'Invalid reportName parameter' }, { status: 400 });
  }
}

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

    // 2. Fetch all your subscribers
    const subResult = await pool.query('SELECT email FROM subscribers');
    const emails = subResult.rows.map(row => row.email);

    if (emails.length > 0) {
      // Send personalized emails so the unsubscribe link targets each recipient.
      await Promise.all(emails.map(async (userEmail: string) => {
        const unsubscribeLink = `https://yourwebsite.com/unsubscribe?email=${encodeURIComponent(userEmail)}`;
        return resend.emails.send({
          from: 'Blog <newsletter@yourdomain.com>',
          to: userEmail,
          subject: `New Post: ${title}`,
          html: `
            <h1>${title}</h1>
            <p>A new article has been published in <strong>${categoryValue}</strong>.</p>
            <a href="https://yourwebsite.com/blog?slug=${finalSlug}">Read the full post here</a>
            <br/><br/>
            <small>You're receiving this because you subscribed to our blog.</small>
            <hr />
            <p style="font-size: 12px; color: #666;">
              Don't want these anymore? 
              <a href="${unsubscribeLink}">Unsubscribe here</a>.
            </p>
          `,
        });
      }));
    }

    return NextResponse.json(newPost.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  const { id, title, content, slug, featuredImageUrl, category, status } = body;
  const categoryValue = category || 'General';

  try {
    const updatedPost = await pool.query(
      'UPDATE posts SET title = $1, content = $2, slug = $3, status = $4, featured_image_url = $5, category = $6 WHERE id = $7 RETURNING *',
      [title, content, slug, status, featuredImageUrl, categoryValue, id]
    );
    return NextResponse.json(updatedPost.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}