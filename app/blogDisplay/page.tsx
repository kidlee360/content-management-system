"use client";
import React, { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPostDisplayProps {
  title: string;
  htmlContent: string;
  publishedAt: string;
}

const BlogPostDisplay: React.FC<BlogPostDisplayProps> = ({ title, htmlContent, publishedAt }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // Sanitize the HTML from Supabase to prevent XSS attacks
    // This allows the 'style' attribute for your image widths and floats
    const clean = DOMPurify.sanitize(htmlContent, {
      ADD_ATTR: ['style', 'float'], // Crucial for your image resizing/wrapping
      ADD_TAGS: ['iframe'], // If you decide to add videos later
    });
    setSanitizedHtml(clean);
  }, [htmlContent]);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>
        <div className="text-gray-500 text-sm">
          Published on {new Date(publishedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </header>

      {/* Content Section */}
      <div 
        className="prose prose-lg prose-blue max-w-none 
                   prose-img:rounded-xl prose-headings:text-gray-900
                   prose-p:text-gray-700 prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      
      {/* Custom styles for the image floats we built in Tiptap */}
      <style jsx global>{`
        .prose img {
          display: inline-block; /* Essential for floating to work */
        }
        /* Ensure the float classes from your editor are respected */
        img[style*="float: left"] {
          margin-right: 1.5rem;
          margin-bottom: 1rem;
          float: left;
        }
        img[style*="float: right"] {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          float: right;
        }
      `}</style>
    </article>
  );
};

export default BlogPostDisplay;