import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { WordReveal } from './animations/WordReveal';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../admin/services/firestoreService';
import { Blog as BlogType } from '../admin/types';

export const BlogSection: React.FC = () => {
  const { lang, dict } = useLanguage();
  const bt = dict[lang].blogTexts;
  const navigate = useNavigate();
  const isBHS = lang === 'BHS';
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAll();
        // Uzmi samo zadnja 3 objavljena
        const published = data.filter(b => b.status === 'published');
        published.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
        setBlogs(published.slice(0, 3));
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="py-24 bg-brand-cream relative flex justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={40} />
      </section>
    );
  }

  // Ako nema blogova, ne prikazuj sekciju
  if (blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content */}
        <div className="text-center mb-16 relative">
          <WordReveal 
            text={bt.sectionTitle}
            center
            className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-4"
          />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg mb-8">
            {bt.sectionSubtitle}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 mb-12">
          {blogs.map((blog) => {
            const data = lang === 'BHS' ? blog.bhs : blog.en;
            const displayData = data.title ? data : (lang === 'BHS' ? blog.en : blog.bhs);

            return (
              <div 
                key={blog.id} 
                onClick={() => navigate(`/${isBHS ? 'blog' : 'en-blog'}/${blog.slug}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-dark/10 z-10 group-hover:bg-transparent transition-colors duration-300" />
                  {blog.coverImage ? (
                    <img 
                      src={blog.coverImage} 
                      alt={displayData.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-300 font-serif text-4xl">{bt.coverPlaceholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-4">
                    {blog.publishedAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> 
                        {new Date(blog.publishedAt).toLocaleDateString(isBHS ? 'bs' : 'en-US')}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-dark mb-3 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                    {displayData.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                    {displayData.excerpt}
                  </p>
                  
                  <div className="flex items-center text-brand-blue text-sm font-bold gap-2 mt-auto group-hover:gap-3 transition-all">
                    {bt.readMore} <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => navigate(isBHS ? '/blog' : '/en-blog')}
            className="px-8 py-4 bg-white border border-gray-200 text-brand-dark font-bold rounded-2xl hover:border-brand-blue hover:text-brand-blue transition-all flex items-center gap-2"
          >
            {bt.allArticles} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
