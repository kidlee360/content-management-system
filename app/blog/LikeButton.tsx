import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';


const LikeButton = ({ postId, initialLikes }: { postId: number, initialLikes: number }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
  const storageKey = `liked_${postId}`;
  if (localStorage.getItem(storageKey)){
    setHasLiked(true);
    toast.info("You've already liked this post!");
    return;
  } ; // Already liked!
  
  try {
    setLikes(prev => prev + 1);
    localStorage.setItem(storageKey, 'true'); // Save to browser
    await axios.post(`/api/posts/like`, { postId });
    setHasLiked(true);
    toast.success('Post liked!', { icon: '❤️' });
  } catch (err) {
    // ... error handling
    console.error("Failed to like the post", err);
    setLikes(prev => prev - 1);
    localStorage.removeItem(storageKey);
    toast.error('Failed to save like. Try again?');
  }
};

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
        hasLiked 
        ? 'bg-pink-50 border-pink-200 text-pink-600' 
        : 'hover:bg-gray-50 border-gray-200 text-gray-600'
      }`}
    >
      <svg 
        className={`w-5 h-5 ${hasLiked ? 'fill-current' : 'fill-none'}`} 
        stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="font-bold">{likes}</span>
    </button>
  );
};
export default LikeButton;