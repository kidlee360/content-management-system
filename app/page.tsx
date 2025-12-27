"use client";

import { useState } from 'react';
import ImageUploader from './components/file';
import ContentEditor from './components/contentEditor';
import Header from './components/header';
import Category from './components/category';
import axios from 'axios';

export default function CMSPostEditor() {
  interface postData {
    title: string;
    content: string;
    slug: string;
    featuredImageUrl: string;
    category: string

  };
  const [postData, setPostData] = useState<postData>({ title: '', content: '', slug: '', featuredImageUrl: '', category: '' });
  const [status, setStatus] = useState<'draft' | 'published'>('draft');


  function changeCategory(category: string){
    setPostData((prev) => ({ ...prev, category }));
  }
  const handleImageUpload = (url: string) => {
    setPostData((prev) => ({ ...prev, featuredImageUrl: url }));
  };

  const submitEditor = (title: string, content: string, slug: string) => {
    setPostData((prev) => ({ ...prev, title, content, slug }));
    console.log(postData);
  };

  const submitForm = (buttonText: string | null) => {
    if (buttonText === 'Publish Post') {
      setStatus('published');
    } else {
      setStatus('draft');
    }
    formData(postData, status);
  }


  const formData = async (postData: postData, status: 'draft' | 'published') =>{
      const addPostData = {title: postData.title, content: postData.content, slug: postData.slug, featuredImageUrl: postData.featuredImageUrl, category: postData.category, status: status};
      console.log("Submitting Post Data:", addPostData);
      // Here you would typically send `addPostData` to your backend API
      try {
        const response = await axios.post('/api/posts', addPostData);
        console.log('Post submitted successfully:', response.data);
        alert('Post submitted successfully!');
        setPostData({ title: '', content: '', slug: '', featuredImageUrl: '', category: '' }); // Reset form
        setStatus('draft'); // Reset status
      } catch (error) {
        console.error('Error submitting post:', error);
      }

    }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Header Bar */}
      <Header bClicked={submitForm} />

      {/* Main Grid: Left (70%) and Right (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT COLUMN: The Content Canvas */}
        <ContentEditor edtiorChange={submitEditor} />

        {/* RIGHT COLUMN: The Metadata Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Featured Image Section */}
          <ImageUploader onUploadSuccess={handleImageUpload} />

          {/* Status & Category Section */}
          <Category categoryChange={changeCategory} />

        </aside>
      </div>
    </div>
  );
}
