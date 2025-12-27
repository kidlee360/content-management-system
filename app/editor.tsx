import React, { useState } from 'react';




export default function CMSPostEditor() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center mb-8 border-b pb-4 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">New Article</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Save Draft</button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">
            Publish Post
          </button>
        </div>
      </header>

      {/* Main Grid: Left (70%) and Right (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT COLUMN: The Content Canvas */}
        <main className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Title Input */}
            <input 
              type="text" 
              placeholder="Post Title..." 
              className="w-full text-4xl font-extrabold border-none focus:ring-0 mb-4 placeholder-gray-300"
            />
            
            {/* Auto-Generated Slug (Visual feedback) */}
            <div className="text-sm text-gray-400 mb-8 flex items-center">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">URL: /blog/your-title-here</span>
            </div>

            {/* Content Body (The Rich Text Area) */}
            <textarea 
              placeholder="Start writing your story..."
              className="w-full h-96 border-none focus:ring-0 text-lg text-gray-700 resize-none"
            ></textarea>
          </div>
        </main>

        {/* RIGHT COLUMN: The Metadata Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Featured Image Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Featured Image</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
              <span>Upload Photo</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Recommended size: 1200x630px</p>
          </section>

          {/* Status & Category Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Post Settings</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Technology</option>
                <option>Business</option>
                <option>Marketing</option>
              </select>
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}