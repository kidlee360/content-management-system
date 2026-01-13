"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { LuPlus, LuPencil, LuTrash2, LuEye } from 'react-icons/lu';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/admin-list'); // A route that returns ALL posts
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/posts?id=${id}`);
      setPosts(posts.filter((p: any) => p.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 uppercase font-bold">Total Views</p>
    <p className="text-2xl font-black text-blue-600">
      {posts.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0)}
    </p>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 uppercase font-bold">Published</p>
    <p className="text-2xl font-black text-green-600">
      {posts.filter((p: any) => p.status === 'published').length}
    </p>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 uppercase font-bold">Drafts</p>
    <p className="text-2xl font-black text-yellow-600">
      {posts.filter((p: any) => p.status === 'draft').length}
    </p>
  </div>
</div>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
            <p className="text-gray-500">Manage your drafts and published stories</p>
          </div>
          <Link 
            href="/admin/editor" 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <LuPlus size={20} /> New Post
          </Link>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Views</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-xs text-gray-400">{post.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 flex items-center gap-1">
                    <LuEye size={14} /> {post.views || 0}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link 
                      href={`/?id=${post.id}`}
                      className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <LuPencil size={18} />
                    </Link>
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-400">No posts found. Start writing!</div>
          )}
        </div>
      </div>
    </div>
  );
}