"use client";
import React, { useState, useRef, useEffect } from "react";
import {LuImagePlus} from 'react-icons/lu'

interface RichTextEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent,
  onContentChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onContentChange(newContent);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          const img = document.createElement("img");
          img.src = imageUrl;
          img.style.maxWidth = "100%";
          img.style.borderRadius = "8px"
          editorRef.current?.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
          } else {
            editorRef.current?.appendChild(img);
          }
          handleContentChange();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="relative">
      <div className="flex items-center p-2 border-b border-gray-200">
        <button
          onClick={handleImageUpload}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Image"
        >
        <LuImagePlus size={20}/>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className="w-full p-4 min-h-[200px] rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
};

export default RichTextEditor;
