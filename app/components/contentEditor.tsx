"use client";
import { useState, useEffect } from 'react';
import UtilFunction from './utilFunction';
import RichTextEditor from './richTextEditor';
import { LuImagePlus } from 'react-icons/lu';

// Added 'existingPost' to props so we can load data for editing
export default function ContentEditor({ edtiorChange, uploadProgress, existingPost }: any) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState<string>('');
  const { generateSlug: slugGenerator } = UtilFunction();

  // EFFECT: If we are in "Edit Mode" (existingPost is provided), 
  // populate the local state with the post data.
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title || '');
      setSlug(existingPost.slug || '');
      setContent(existingPost.content || '');
      // Tell the parent (Layout) about the loaded content immediately
      edtiorChange(existingPost.title, existingPost.content, existingPost.slug);
    }
  }, []);

  const ProgressBar = () => {
    if (!uploadProgress) return null;
    const pct = uploadProgress.total > 0 ? Math.round((uploadProgress.completed / uploadProgress.total) * 100) : 0;
    return (
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Uploading images: {uploadProgress.completed}/{uploadProgress.total} ({pct}%)</div>
        <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div className="bg-blue-500 h-2 rounded" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  const handleTitleChange = (e: any) => {
    const newTitle = e.target.value;
    const newSlug = slugGenerator(newTitle);
    setTitle(newTitle);
    setSlug(newSlug);
    edtiorChange(newTitle, content, newSlug);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    edtiorChange(title, newContent, slug);
  };

  return (
    <main className="lg:col-span-7 space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <ProgressBar />
        <input 
          type="text" 
          placeholder="Post Title..." 
          className="w-full text-4xl font-extrabold border-none focus:ring-0 mb-4 placeholder-gray-300 outline-none"
          value={title}
          onChange={handleTitleChange}
        />
        
        <div className="text-sm text-gray-400 mb-8 flex items-center">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Slug: {slug}</span>
        </div>

        <RichTextEditor
          initialContent={content}
          onContentChange={handleContentChange}
        />
      </div>
    </main>
  );
}