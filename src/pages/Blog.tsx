import React, { useEffect, useState } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  published: boolean;
};

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulated posts
        const mockPosts: BlogPost[] = [
          {
            id: 1,
            title: "Caring for Newborn Skin",
            excerpt:
              "Tips and tricks for keeping your baby’s skin soft and healthy.",
            content:
              "Your baby’s skin is delicate and requires special care... (full article here).",
            image_url: "/images/baby.jpg",
            created_at: new Date().toISOString(),
            published: true,
          },
          {
            id: 2,
            title: "Best Bedtime Routines",
            excerpt:
              "How to create a calming routine that helps your baby sleep better.",
            content:
              "Establishing a consistent bedtime routine helps your baby understand when it’s time to sleep...",
            image_url: "/images/green.png",
            created_at: new Date().toISOString(),
            published: true,
          },
             {
            id: 3,
            title: "Best Bedtime Routines",
            excerpt:
              "How to create a calming routine that helps your baby sleep better.",
            content:
              "Establishing a consistent bedtime routine helps your baby understand when it’s time to sleep...",
            image_url: "/images/care.png",
            created_at: new Date().toISOString(),
            published: true,
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API delay
        setPosts(mockPosts);
        toast.success("Blog posts loaded!");
      } catch {
        toast.error("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (selectedPost) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              setSelectedPost(null);
              toast("Back to blog list 📚");
            }}
            className="mb-8 text-peach-600 dark:text-peach-400 hover:underline flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Blog</span>
          </button>

          <article className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl animate-fade-in-up">
            <div className="h-96 overflow-hidden">
              <img
                src={selectedPost.image_url}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {selectedPost.title}
              </h1>
              <div className="flex items-center space-x-6 mb-8 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(selectedPost.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Preferrable Team</span>
                </div>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-peach-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
            Blog & Tips
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Expert advice and tips for caring for your little one
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  toast.success(`Opening "${post.title}"`);
                  setSelectedPost(post);
                }}
              >
                <div className="relative h-48 overflow-hidden bg-peach-100 dark:bg-gray-700">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Preferrable</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button className="text-peach-600 dark:text-peach-400 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
