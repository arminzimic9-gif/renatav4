import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Footer } from '../components/Footer';
import { WordReveal } from '../components/animations/WordReveal';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../admin/services/firestoreService';
import { Blog as BlogType } from '../admin/types';

interface BlogProps {
  onNavigate: (page: any, lang: any) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
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
        setBlogs(data.filter(b => b.status === 'published'));
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col pt-28 md:pt-24">
      <div className="flex-1 max-w-7xl mx-auto px-6 w-full pb-24">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <WordReveal 
            text={bt.blogPageTitle}
            center
            className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-4"
          />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {bt.blogPageSubtitle}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-brand-blue" size={40} />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {bt.noArticles}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {blogs.map((blog) => {
              const data = lang === 'BHS' ? blog.bhs : blog.en;
              // Ako nema prevoda za odabrani jezik, prikaži onaj koji ima
              const displayData = data.title ? data : (lang === 'BHS' ? blog.en : blog.bhs);
              
              return (
                <div 
                  key={blog.id} 
                  onClick={() => navigate(`/${lang === 'BHS' ? 'blog' : 'en-blog'}/${blog.slug}`)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer group hover:-translate-y-1"
                >
                  <div className="h-56 overflow-hidden relative">
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
                  
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-4">
                      {blog.publishedAt && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} /> 
                          {new Date(blog.publishedAt).toLocaleDateString(lang === 'BHS' ? 'bs' : 'en-US')}
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
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
