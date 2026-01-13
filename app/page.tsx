"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Added searchParams
import ImageUploader from './components/file';
import ContentEditor from './components/contentEditor';
import Header from './components/header';
import Category from './components/category';
import axios from 'axios';
import { uploadImagesInHtml } from '../lib/uploadImages';

export default function CMSPostEditor() {
  interface postData {
    id?: number; // Added ID to the interface
    title: string;
    content: string;
    slug: string;
    featuredImageUrl: string;
    category: string;
  }

  const [postData, setPostData] = useState<postData>({ title: '', content: '', slug: '', featuredImageUrl: '', category: '' });
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('id');

  // EFFECT: Detect if we are editing an existing post
  useEffect(() => {
    if (postId) {
      setIsEditMode(true);
      fetchExistingPost(postId);
    }
  }, [postId]);

  const fetchExistingPost = async (id: string) => {
    setIsLoading(true);
    try {
      // Create an API route or use your existing post fetcher
      const response = await axios.get(`/api/posts/editor?id=${id}`); 
      const post = response.data;
      
      setPostData({
        id: post.id,
        title: post.title,
        content: post.content,
        slug: post.slug,
        featuredImageUrl: post.featured_image_url || '',
        category: post.category || ''
      });
      setStatus(post.status);
    } catch (error) {
      console.error("Error fetching post for edit:", error);
      alert("Could not load post data.");
    } finally {
      setIsLoading(false);
    }
  };

  const changeCategory = (category: string) => {
    setPostData((prev) => ({ ...prev, category }));
  }

  const handleImageUpload = (url: string) => {
    setPostData((prev) => ({ ...prev, featuredImageUrl: url }));
  };

  const submitEditor = (title: string, content: string, slug: string) => {
    setPostData((prev) => ({ ...prev, title, content, slug }));
  };

  const submitForm = (buttonText: string | null) => {
    const newStatus = buttonText === 'Publish Post' ? 'published' : 'draft';
    formData(postData, newStatus);
  }

  const formData = async (postData: postData, targetStatus: 'draft' | 'published') => {
    let contentToSubmit = postData.content;
    
    // 1. Upload images from HTML
    try {
      const result = await uploadImagesInHtml(postData.content, postData.slug, (completed, total) => {
        setUploadProgress({ completed, total });
      });
      contentToSubmit = result.content;
    } catch (err) {
      console.error('Error uploading images:', err);
    } finally {
      setTimeout(() => setUploadProgress(null), 800);
    }

    const payload = {
      ...postData,
      content: contentToSubmit,
      status: targetStatus
    };

    // 2. Submit to Backend (POST for new, PUT for existing)
    try {
      if (isEditMode && postId) {
        // UPDATE EXISTING
        await axios.put(`/api/posts`, payload);
        alert('Post updated successfully!');
        router.push('/admin/dashboard');
      } else {
        // CREATE NEW
        await axios.post('/api/posts', payload);
        alert('Post created successfully!');
        // Redirect to edit mode for the new post or reset
        router.push('/admin/dashboard'); 
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save post.');
    }
  };

  //--------ADD A BUTTON TO DISCARD CHANGES WHEN YOURE READY TO USE THIS--------//
  const discardChanges = () => {
    if (confirm("Discard all unsaved changes?")) {
      if (isEditMode) {
        // Re-fetch the original data from the DB
        fetchExistingPost(postId!);
      } else {
        // Reset to empty for a new post
        setPostData({ title: '', content: '', slug: '', featuredImageUrl: '', category: '' });
      }
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading post data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Header bClicked={submitForm} />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* Pass the data into ContentEditor */}
        <ContentEditor 
          edtiorChange={submitEditor} 
          uploadProgress={uploadProgress} 
          existingPost={isEditMode ? postData : null} 
        />
        
        <aside className="lg:col-span-3 space-y-6">
          <ImageUploader 
            onUploadSuccess={handleImageUpload} 
            //initialImage={postData.featuredImageUrl} 
          />
          <Category 
            categoryChange={changeCategory} 
            initialCategory={postData.category} 
          />
        </aside>
      </div>
    </div>
  );
}