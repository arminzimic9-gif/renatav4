import React, { useEffect, useState } from 'react';
import { useSiteImage, useSiteImageList, bgStyle, posVars } from '../context/SiteImagesContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Footer } from '../components/Footer';
import { Calendar, ArrowLeft, Loader2, Facebook, Linkedin, Instagram } from 'lucide-react';
import { blogService } from '../admin/services/firestoreService';
import { Blog as BlogType } from '../admin/types';

interface BlogPostProps {
  onNavigate: (page: any, lang: any) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ onNavigate }) => {
  const authorImg = useSiteImage('blogAuthor');
  const { slug } = useParams<{ slug: string }>();
  const { lang, dict } = useLanguage();
  const bt = dict[lang].blogTexts;
  const navigate = useNavigate();
  const isBHS = lang === 'BHS';
  
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const blogs = await blogService.getAll();
        const found = blogs.find(b => b.slug === slug && b.status === 'published');
        if (found) {
          setBlog(found);
          // Set SEO metadata if available
          const seoData = found.seo[lang === 'BHS' ? 'bhs' : 'en'];
          if (seoData.metaTitle) document.title = seoData.metaTitle;
        } else {
          navigate(isBHS ? '/blog' : '/en-blog', { replace: true });
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    
    // Cleanup title on unmount
    // Vrati naslov stranice iz admina (SEO) kad se napusti objava
    return () => { document.title = (dict as any)[lang]?.seo?.siteTitle || 'HabitPlus'; };
  }, [slug, lang, navigate, isBHS]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex justify-center items-center">
        <Loader2 className="animate-spin text-brand-blue" size={40} />
      </div>
    );
  }

  if (!blog) return null;

  const data = lang === 'BHS' ? blog.bhs : blog.en;
  const displayData = data.title ? data : (lang === 'BHS' ? blog.en : blog.bhs);

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col pt-24">
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full pb-24">
        
        <Link 
          to={isBHS ? '/blog' : '/en-blog'} 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-blue font-medium mb-6 md:mb-10 transition-colors"
        >
          <ArrowLeft size={18} />
          {bt.backToBlog}
        </Link>

        {blog.coverImage && (
          <div className="w-full aspect-[16/10] md:aspect-auto md:h-[500px] rounded-3xl md:rounded-[2.5rem] overflow-hidden mb-8 md:mb-12 shadow-sm border border-gray-100">
            <img 
              src={blog.coverImage} 
              alt={displayData.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 text-gray-400 font-medium mb-6">
            {blog.category && (
              <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-sm">
                {blog.category}
              </span>
            )}
            {blog.publishedAt && (
              <span className="flex items-center gap-1.5 text-sm">
                <Calendar size={14} /> 
                {new Date(blog.publishedAt).toLocaleDateString(isBHS ? 'bs' : 'en-US')}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-dark leading-tight mb-8">
            {displayData.title}
          </h1>

          {/* HTML Content Render */}
          <div 
            className="prose prose-base md:prose-lg max-w-none text-gray-600 space-y-6 [&_iframe]:max-w-full [&_table]:block [&_table]:overflow-x-auto prose-headings:font-serif prose-headings:text-brand-dark prose-a:text-brand-blue prose-img:rounded-2xl prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: displayData.content }}
          />

          {/* Author Block */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={authorImg.url} alt={blog.author} className="hp-pos w-16 h-16 rounded-full object-cover border-2 border-brand-blue/10 shadow-sm" style={posVars(authorImg)} />
              <div>
                <p className="text-lg font-bold text-brand-dark">{blog.author || bt.defaultAuthor}</p>
                <p className="text-sm text-gray-500">{bt.authorRole}</p>
              </div>
            </div>
            
            {/* Share buttons */}
            <div className="flex gap-3">
               <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm border border-gray-100 hover:border-[#1877F2]">
                  <Facebook size={18} />
               </a>
               <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all shadow-sm border border-gray-100 hover:border-[#0077b5]">
                  <Linkedin size={18} />
               </a>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
