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
  views: number;
  featured_image_url?: string;
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
    <div className="min-h-screen bg-gray-50/50 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION: Header --- */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
            Insights & Stories
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Exploring the intersection of technology, design, and business strategy.
          </p>
        </header>

        {/* --- SECTION: Search & Filter Bar --- */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input with Icon */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Search articles..."
              />
            </div>

            {/* Sort & Category Dropdowns - Clean Styles */}
            <div className="flex gap-3 w-full md:w-auto">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)} 
                className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-medium text-gray-700 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>

              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value as any)} 
                className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-medium text-gray-700 outline-none"
              >
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- SECTION: Posts Grid --- */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((p) => {
              const dateStr = p.updated_at || p.created_at || null;
              const formatted = dateStr ? new Date(String(dateStr)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';
              const excerpt = getExcerpt(p.content, 120);

              return (
                <Link key={p.id} href={`/blog?slug=${p.slug}`} className="group">
                  <article className="h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    
                    {/* Featured Image Area */}
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                      {p.featured_image_url ? (
                        <img 
                          src={p.featured_image_url} 
                          alt={p.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-300">
                           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-gray-700 rounded-full shadow-sm">
                          {p.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
                        <span>{formatted}</span>
                        <span>•</span>
                        <span>{p.views || 0} views</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {p.title}
                      </h2>
                      
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                        {excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-sm font-bold text-blue-600">
                        Read Article 
                        <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

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
    </div>
  );
};
