// app/blog/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import PostPage from './BlogClient';
import pool from '@/lib/db';

export async function generateMetadata({ searchParams }: { searchParams: { slug?: string } }): Promise<Metadata> {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const slug = resolvedSearchParams.slug;
  if (!slug) return { title: 'Blog Feed' };

  try {
    // We fetch from your local API route
    // Note: On the server, we often need the full URL (http://localhost:3000)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    //const res = await fetch(`${baseUrl}/api/posts/slug?slug=${slug}`);
    //const post = await res.json();

    // Query the database directly
    const result = await pool.query('SELECT * FROM posts WHERE slug = $1 LIMIT 1', [slug]);
    if (!result.rows || result.rows.length === 0) return { title: 'Post Not Found' };
    const post = result.rows[0];

    if (!post) return { title: 'Post Not Found' };

    // Clean description (strips HTML tags)
    const description = post.content?.replace(/<[^>]+>/g, '').slice(0, 160) || "";
    
    // Find the first Supabase image URL in the content
    const imageMatch = post.content?.match(/<img src="([^"]+)"/);
    const ogImage = imageMatch ? imageMatch[1] : `${baseUrl}/default-og.png`;


    return {
      title: post.title,
      description: description,
      openGraph: {
        title: post.title,
        description: description,
        images: [{ url: ogImage }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        images: [ogImage],
      }
    };
  } catch (error) {
    return { title: 'Blog Post' };
  }
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PostPage />
    </Suspense>
  );
}