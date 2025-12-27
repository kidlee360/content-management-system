import { useState } from 'react';
import UtilFunction from './utilFunction';
import RichTextEditor from './richTextEditor';
import {LuImagePlus} from 'react-icons/lu'

export default function ContentEditor({ edtiorChange }: any) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const { generateSlug: slugGenerator } = UtilFunction();


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
            {/* Title Input */}
            <input 
              type="text" 
              placeholder="Post Title..." 
              className="w-full text-4xl font-extrabold border-none focus:ring-0 mb-4 placeholder-gray-300"
              value={title}
              onChange={handleTitleChange}
            />
            
            {/* Auto-Generated Slug (Visual feedback) */}
            <div className="text-sm text-gray-400 mb-8 flex items-center">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">Slug: {slug}</span>
            </div>

            {/* Content Body (The Rich Text Area) */}
            <RichTextEditor
              initialContent={content}
              onContentChange={handleContentChange}
            />
          </div>
        </main>
  );
}