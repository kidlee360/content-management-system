"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PostRow {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  updated_at?: string;
  created_at?: string;
}

export default function PostPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [post, setPost] = useState<PostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  // 1. Fetch the post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug || slug === 'undefined') {
        setError('Invalid or missing post slug.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('Fetching post with slug:', slug);
        const response = await axios.get(`/api/posts/slug?slug=${slug}`);
        if (!response.data) {
          throw new Error('Failed to fetch post');
        }
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post by slug:', err);
        setError('Error loading post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // 2. Sanitize content once post is loaded
  useEffect(() => {
    // This guard clause prevents the "post is possibly null" error
    if (!post) return;

    // We use require inside useEffect to ensure it only loads in the browser
    const DOMPurify = require('isomorphic-dompurify');
    
    const clean = DOMPurify.sanitize(post.content || '', {
      ADD_ATTR: ['style', 'float'],
      ADD_TAGS: ['iframe'],
    });

    setSanitizedHtml(clean);
  }, [post]);

  // 3. Early returns for Loading and Error states
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-8 text-center">Post not found.</div>;

  // 4. Data formatting (post is guaranteed to exist here)
  const dateStr = post.updated_at || post.created_at || null;
  const formattedDate = dateStr 
    ? new Date(String(dateStr)).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }) 
    : 'Unknown';

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="text-gray-500 text-sm">
          Published on {formattedDate} • <span className="text-gray-700">{post.category || 'Uncategorized'}</span>
        </div>
      </header>

      <div
        className="prose prose-lg prose-blue max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      <style jsx global>{`
        .prose img {
          display: inline-block;
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px;
        }
        img[style*="float: left"] {
          margin-right: 1.5rem;
          margin-bottom: 1rem;
          float: left !important;
        }
        img[style*="float: right"] {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          float: right !important;
        }
        @media (max-width: 640px) {
          .prose img {
            float: none !important;
            margin: 1rem 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </article>
  );
}