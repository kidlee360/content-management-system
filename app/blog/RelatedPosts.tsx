import { useEffect, useState} from 'react';
import axios from 'axios';
import Link from 'next/link';

const RelatedPosts = ({ category, currentId }: { category: string, currentId: number }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`/api/posts/related?category=${category}&currentId=${currentId}`);
        setRelated(res.data);
      } catch (err) {
        console.error("Failed to load related posts", err);
      }
    };
    if (category) fetchRelated();
  }, [category, currentId]);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">More from {category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((p: any) => (
          <Link key={p.id} href={`/blog?slug=${p.slug}`} className="group">
            <div className="bg-gray-50 rounded-lg p-4 h-full border border-transparent group-hover:border-blue-500 transition-all">
              <h4 className="font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2">
                 {p.title}
              </h4>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default RelatedPosts;