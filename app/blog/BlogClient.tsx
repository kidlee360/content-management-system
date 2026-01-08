"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RelatedPosts from './RelatedPosts';
import NewsletterSignup from './NewsLetter';
import LikeButton from './LikeButton';

// Move ShareButtons outside so it's a clean, reusable component
const ShareButtons = ({ title, slug }: { title: string, slug: string }) => {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog?slug=${slug}` : '';
  
  return (
    <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-200">
      <span className="font-bold text-gray-700">Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURI(url)}`} target="_blank" className="p-2 bg-black text-white rounded-full hover:opacity-80"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(url)}`} target="_blank" className="p-2 bg-[#0077b5] text-white rounded-full hover:opacity-80"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
      <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" className="p-2 bg-[#25d366] text-white rounded-full hover:opacity-80"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.963-.505-5.7-1.467l-6.283 1.592zm6.09-3.923l.36.213c1.403.832 3.1 1.272 4.842 1.272 5.067 0 9.189-4.123 9.189-9.189s-4.122-9.189-9.189-9.189c-5.066 0-9.189 4.123-9.189 9.189 0 1.83.543 3.613 1.569 5.155l.233.351-.99 3.614 3.715-.944z"/></svg></a>
    </div>
  );
};

export default function PostPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const response = await axios.get(`/api/posts/slug?slug=${slug}`);
        setPost(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const DOMPurify = require('isomorphic-dompurify');
    const clean = DOMPurify.sanitize(post.content || '', {
      ADD_ATTR: ['style', 'float', 'class'],
      ADD_TAGS: ['iframe'],
    });
    setSanitizedHtml(clean);
  }, [post]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!post) return <div className="p-8 text-center">Post not found.</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
      </header>

      <div 
        className="prose prose-lg max-w-none" 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
      
    {/* LIKE BUTTON & SHARE BUTTONS */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-8">
      <LikeButton postId={post.id} initialLikes={post.likes || 0} />
      <ShareButtons title={post.title} slug={post.slug} />
    </div>

    {/* RELATED POSTS */}
    <RelatedPosts category={post.category} currentId={post.id} />

    {/* NEWSLETTER SIGNUP */}
    <NewsletterSignup />

    {/* Style JSX block ... */}


      <style jsx global>{`
        /* Keep all your fixed float and H1 CSS here */
        .prose h1, .prose h1 strong { font-size: 3rem !important; display: block !important; }
        .prose h2, .prose h2 strong { font-size: 2.5rem !important; display: block !important; }
        img[float="left"], img[style*="float: left"] { float: left !important; margin-right: 20px !important; }
        img[float="right"], img[style*="float: right"] { float: right !important; margin-left: 20px !important; }
        .prose p { display: flow-root !important; }
        @media (max-width: 768px) {
          .prose h1, .prose h1 strong { font-size: 2.25rem !important; }
          .prose h2, .prose h2 strong { font-size: 1.875rem !important; }
          .prose img { float: none !important; margin: 1rem auto !important; display: block !important; }
        }
      `}</style>
    </article>
  );
}