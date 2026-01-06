import supabase from './supabaseClient';

export async function uploadImagesInHtml(content: string, slug = 'post', onProgress?: (completed: number, total: number) => void) {
  // Parse HTML and find images
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const imgs = Array.from(doc.querySelectorAll('img'));
  const uploaded: Array<{ original: string; url: string }> = [];

  // Filter only embedded images (data/blob)
  const targets = imgs.filter((img) => {
    const s = img.getAttribute('src') || '';
    return s.startsWith('data:') || s.startsWith('blob:');
  });

  const total = targets.length;
  if (total === 0) return { content: doc.body.innerHTML, uploaded };

  onProgress?.(0, total);

  for (let i = 0; i < targets.length; i++) {
    const img = targets[i];
    const src = img.getAttribute('src') || '';
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const mime = blob.type || 'image/png';
      const ext = mime.split('/')[1] || 'png';
      const filename = `${slug}-${Date.now()}-${i}.${ext}`;

      // Upload to the `images` bucket. Ensure this bucket exists in your Supabase project.
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filename, blob, { contentType: mime });

      if (uploadError) {
        console.error('Supabase upload error for', filename, uploadError);
        // advance progress even on error
        onProgress?.(i + 1, total);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filename);

      const publicUrl = publicData.publicUrl;
      img.setAttribute('src', publicUrl);
      uploaded.push({ original: src, url: publicUrl });
    } catch (err) {
      console.error('Error processing image src:', src, err);
    }

    onProgress?.(i + 1, total);
    console.log(`Uploaded ${i + 1} of ${total} images`);
  }

  return { content: doc.body.innerHTML, uploaded };
}
