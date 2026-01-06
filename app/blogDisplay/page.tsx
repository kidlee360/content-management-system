"use client";
import { useEffect, useState, useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import axios from 'axios';
import Link from 'next/link';


export default function DisplayPage(){

interface BlogPostDisplay {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  updated_at: string;
  created_at?: string;
}

const [posts, setPosts] = useState<BlogPostDisplay[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const [categoryFilter, setCategoryFilter] = useState<'All' | string>('All');
const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'category-asc' | 'category-desc'>('newest');
const [searchQuery, setSearchQuery] = useState('');
const [appliedSearch, setAppliedSearch] = useState('');

// GET ROUTE - fetch all posts
const fetchPostData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(`/api/posts?reportName=publishedPosts`);
    if (!response.data) {
      throw new Error('Failed to fetch post data');
    }
    const data = response.data;
    const list = Array.isArray(data) ? data : [data];
    setPosts(list);
  } catch (error) {
    console.error('Error fetching post data:', error);
    setError('Failed to load post data.');
    setPosts([]);
  } finally {
    setLoading(false);
  }
};

// Helper to generate short plaintext excerpt
const getExcerpt = (html: string, length = 220) => {
  const clean = DOMPurify.sanitize(html || '');
  const textOnly = clean.replace(/<[^>]+>/g, '');
  return textOnly.length > length ? `${textOnly.slice(0, length)}...` : textOnly;
};

// Categories derived from posts
const categories = useMemo(() => {
  const cats = Array.from(new Set(posts.map(p => p.category || 'Uncategorized')));
  return ['All', ...cats];
}, [posts]);

// Filter, search and sort
const filteredPosts = useMemo(() => {
  let list = posts.slice();

  if (categoryFilter !== 'All') {
    list = list.filter(p => (p.category || 'Uncategorized') === categoryFilter);
  }

  if (appliedSearch) {
    const q = appliedSearch.toLowerCase();
    list = list.filter(p => (p.title || '').toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q));
  }

  switch (sortOption) {
    case 'newest':
      list.sort((a, b) => {
        const aTime = a.updated_at || a.created_at || '';
        const bTime = b.updated_at || b.created_at || '';
        return (bTime ? new Date(bTime).getTime() : 0) - (aTime ? new Date(aTime).getTime() : 0);
      });
      break;
    case 'oldest':
      list.sort((a, b) => {
        const aTime = a.updated_at || a.created_at || '';
        const bTime = b.updated_at || b.created_at || '';
        return (aTime ? new Date(aTime).getTime() : 0) - (bTime ? new Date(bTime).getTime() : 0);
      });
      break;
    case 'category-asc':
      list.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
      break;
    case 'category-desc':
      list.sort((a, b) => (b.category || '').localeCompare(a.category || ''));
      break;
  }

  return list;
}, [posts, categoryFilter, sortOption, appliedSearch]);

// Fetch once
useEffect(() => {
  fetchPostData();
}, []);
  

  const [sanitizedHtml, setSanitizedHtml] = useState('');

  // Fetch once on mount
  useEffect(() => {
    fetchPostData();
  }, []);

  // UI states
  const onSearch = () => setAppliedSearch(searchQuery.trim());

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  // Debounce live-search so filtering happens while typing but not on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setAppliedSearch(searchQuery.trim());
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!posts || posts.length === 0) return <div className="p-8 text-center">No posts found.</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600">Browse recent posts. Use the search and filters to narrow results.</p>
      </header>

      {/* Controls: Search, Category Filter, Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDownSearch}
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Search by title or slug"
            aria-label="Search posts by title or slug"
          />
          <button onClick={onSearch} className="px-3 py-2 bg-blue-600 text-white rounded-md">Search</button>
        </div>

        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <label className="text-sm text-gray-600">Category</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border rounded-md">
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="text-sm text-gray-600">Sort</label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value as any)} className="px-3 py-2 border rounded-md">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="category-asc">Category A → Z</option>
            <option value="category-desc">Category Z → A</option>
          </select>
        </div>
      </div>

      {/* Posts list */}
      <section>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">No posts match your filters.</div>
        ) : (
          filteredPosts.map((p) => {
            const dateStr = p.updated_at || p.created_at || null;
            const formatted = dateStr ? new Date(String(dateStr)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';
            const excerpt = getExcerpt(p.content);

            return (
              <article key={p.id} className="mb-8 border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{p.title}</h2>
                <div className="text-sm text-gray-500 mb-2">Published on {formatted} • <span className="text-gray-700">{p.category || 'Uncategorized'}</span></div>
                <p className="text-gray-700 mb-3">{excerpt}</p>
                {p.slug ? (
                  <Link href={`/blog?slug=${p.slug}`} className="text-blue-600 hover:underline">Read more</Link>
                ) : (
                  <span className="text-gray-400">Read more</span>
                )}
              </article>
            );
          })
        )}
      </section>

      {/* Custom styles for the image floats we built in Tiptap */}
      <style jsx global>{`
        .prose img {
          display: inline-block; /* Essential for floating to work */
          /* This ensures images NEVER go wider than the phone screen */
          max-width: 100% !important; 
          height: auto !important;
          border-radius: 8px;
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
};
