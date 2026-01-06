"use client";
import React from 'react';
import { useEditor, EditorContent, } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { LuImagePlus, LuBold, LuItalic, LuHeading1, LuHeading2, LuCode, LuLink, LuTrash2, LuAlignLeft, LuAlignCenter, LuAlignRight } from 'react-icons/lu';
import { ResizableImage } from './resizableImage'; // adjust path

interface TiptapEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const TiptapEditor = ({ initialContent, onContentChange }: TiptapEditorProps) => {
  const editor = useEditor({ 
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading','paragraph'] }),
      ResizableImage.configure({
        inline: true,
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  // Update the image upload to use the custom width
const handleImageUpload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        // default float is 'none' when inserting new images
        editor.chain().focus().setImage({ src: url, width: '300px', float: 'none' } as any).run();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

const handleEditorChange = () => {
  const content = editor.getHTML();
  onContentChange(content);
};

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* 1. BUBBLE MENU - Appears on text selection */}
      <BubbleMenu 
        editor={editor} 
        //tippyOptions={{ duration: 100 }}
        className="flex items-center gap-1 p-1 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('bold') ? 'text-blue-400' : ''}`}
        >
          <LuBold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('italic') ? 'text-blue-400' : ''}`}
        >
          <LuItalic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('code') ? 'text-blue-400' : ''}`}
        >
          <LuCode size={16} />
        </button>
         <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('textAlign', { align: 'left' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Align Text Left"
        >
          <LuAlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('textAlign', { align: 'center' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Align Text Center"
        >
          <LuAlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('textAlign', { align: 'right' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Align Texts Right"
        >
          <LuAlignRight size={16} />
        </button>
        <div className="w-[1px] h-4 bg-gray-600 mx-1" />
        <button
          onClick={() => {
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('link') ? 'text-blue-400' : ''}`}
        >
          <LuLink size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'left' }).run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('image', { float: 'left' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Float image left"
        >
          <LuAlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'center' }).run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('image', { float: 'center' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Center image"
        >
          <LuAlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'right' }).run()}
          className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('image', { float: 'right' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Float image right"
        >
          <LuAlignRight size={16} />
        </button>
      </BubbleMenu>
      {/* TOOLBAR */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <LuBold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <LuItalic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <LuHeading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <LuHeading2 size={18} />
        </button>

        <div className="w-[1px] h-6 bg-gray-300 mx-1" />

        {/* Text alignment buttons */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded ${editor.isActive('textAlign', { align: 'left' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Align Text Left"
        >
          <LuAlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded ${editor.isActive('textAlign', { align: 'center' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Align Text Center"
        >
          <LuAlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded ${editor.isActive('textAlign', { align: 'right' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Align Texts Right"
        >
          <LuAlignRight size={18} />
        </button>

        <button onClick={handleImageUpload} className="p-2 rounded hover:bg-gray-200" title="Insert Image">
          <LuImagePlus size={20} />
        </button>

        {/* Image float controls */}
        <button
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'left' }).run()}
          className={`p-2 rounded ${editor.isActive('image', { float: 'left' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Float image left"
        >
          <LuAlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'center' }).run()}
          className={`p-2 rounded ${editor.isActive('image', { float: 'center' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Center image"
        >
          <LuAlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'right' }).run()}
          className={`p-2 rounded ${editor.isActive('image', { float: 'right' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          title="Float image right"
        >
          <LuAlignRight size={18} />
        </button>
      </div>

      {/* EDITABLE AREA */}
      <EditorContent 
        editor={editor} 
        onChange = {handleEditorChange}
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
      />

      {/* RESIZE & DELETE STYLES */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
          outline: none;
        }
        .resizable-image {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          cursor: pointer;
          transition: all 0.2s;
        }
        .resizable-image.ProseMirror-selectednode {
          outline: 3px solid #3b82f6;
        }
        /* Floats for images so text can wrap */
        .ProseMirror .float-left {
          float: left;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
        .ProseMirror .float-right {
          float: right;
          margin-left: 1rem;
          margin-bottom: 1rem;
        }
        .ProseMirror .mx-auto {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .prose p { display: flow-root; }  
      `}</style>
    </div>
  );
};

export default TiptapEditor;