import { createClient } from '@supabase/supabase-js';
import React, { useState } from 'react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ImageUploader( {onUploadSuccess} : { onUploadSuccess: (url: string) => void}) {

   const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`; // Give it a unique name
    const filePath = `post-images/${fileName}`;

    // 1. Upload file to the 'assets' bucket
    console.log('Uploading file to Supabase:', filePath);
    let { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get the Public URL
    const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);

    // 3. Set the featured image URL state
    setFeaturedImageUrl(data.publicUrl);
    console.log('File uploaded to:', data.publicUrl);
    
    // 4. Pass this URL back to your main Form state
    onUploadSuccess(data.publicUrl);
  };

  return (
    

    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Featured Image</h3>
        {featuredImageUrl ? (
          <img src={featuredImageUrl} alt="Featured image" className="w-full h-auto rounded-lg" />
        ) : (
         <label className="border-2 border-dashed border-gray-200 rounded-lg h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
             <input type="file" onChange={handleUpload} className="hidden" />
             <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
             <span>Upload Photo</span>
         </label>
        )}
        <p className="mt-2 text-xs text-gray-500">Recommended size: 1200x630px</p>
      </section>
  );
}