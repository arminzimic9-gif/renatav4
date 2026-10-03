import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { useAdminPanel } from '../context/AdminPanelContext';
import { blogService } from '../services/firestoreService';
import { Blog } from '../types';

const ACCENT = '#5392ce';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: '#0f0f0f', border: '1px solid #2a2a2a',
  borderRadius: '8px', color: '#f5f5f5',
  fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#888',
  fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
  fontWeight: 600, letterSpacing: '0.04em',
  marginBottom: '6px', textTransform: 'uppercase',
};

const emptyBlog = (): Omit<Blog, 'id'> => ({
  slug: '',
  status: 'draft',
  publishedAt: null,
  author: 'Renata Lačević',
  category: '',
  coverImage: '',
  bhs: { title: '', excerpt: '', content: '' },
  en: { title: '', excerpt: '', content: '' },
  seo: {
    bhs: { metaTitle: '', metaDescription: '' },
    en: { metaTitle: '', metaDescription: '' },
  },
});

export const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saveBlog, deleteBlog } = useAdminPanel();
  const isNew = id === 'new';

  const [blog, setBlog] = useState<Blog>({ id: 'new', ...emptyBlog() });
  const [activeLang, setActiveLang] = useState<'bhs' | 'en'>('bhs');
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      blogService.getById(id).then((data) => {
        if (data) setBlog(data);
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const update = (path: string[], value: any) => {
    setBlog((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cur: any = next;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  // Auto-generate slug from BHS title while typing (only when slug is empty)
  const handleBhsTitleChange = (value: string) => {
    update(['bhs', 'title'], value);
    setBlog(prev => {
      if (!prev.slug) {
        const autoSlug = value.toLowerCase()
          .replace(/[čć]/g, 'c').replace(/[šš]/g, 's').replace(/[žž]/g, 'z').replace(/đ/g, 'd')
          .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
        return { ...prev, bhs: { ...prev.bhs, title: value }, slug: autoSlug };
      }
      return prev;
    });
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      // Auto-generate slug from BHS title if still empty
      const finalBlog = !blog.slug && blog.bhs.title
        ? { ...blog, slug: blog.bhs.title.toLowerCase().replace(/[čć]/g, 'c').replace(/[šš]/g, 's').replace(/[žž]/g, 'z').replace(/đ/g, 'd').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
        : blog;
      await saveBlog(finalBlog);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
      if (isNew) navigate('/admin/blog');
    } catch {
      // error handled in context
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj post?')) return;
    await deleteBlog(blog.id);
    navigate('/admin/blog');
  };

  const handlePublishToggle = () => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    update(['status'], newStatus);
    if (newStatus === 'published' && !blog.publishedAt) {
      update(['publishedAt'], new Date().toISOString());
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#888', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
        Učitava se...
      </div>
    );
  }

  const langData = blog[activeLang];

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/admin/blog')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          <ArrowLeft size={16} /> Nazad
        </button>
        <div style={{ width: '1px', height: '20px', background: '#2a2a2a' }} />
        <h1 style={{ color: '#f5f5f5', fontSize: '20px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          {isNew ? 'Novi blog post' : (blog.bhs.title || 'Uredi post')}
        </h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {!isNew && (
            <button onClick={handleDelete} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
              <Trash2 size={14} /> Obriši
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || justSaved}
            style={{ padding: '8px 20px', background: justSaved ? '#22c55e' : ACCENT, border: 'none', borderRadius: '8px', color: '#fff', cursor: (saving || justSaved) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', opacity: saving ? 0.7 : 1, transition: 'all 0.2s' }}
          >
            {justSaved ? <CheckCircle size={15} /> : <Save size={15} />} {saving ? 'Sprema...' : justSaved ? 'Sačuvano!' : 'Spremi'}
          </button>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

        {/* Left: Content */}
        <div>
          {/* Lang tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
            {(['bhs', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                style={{
                  padding: '7px 18px', borderRadius: '7px',
                  background: activeLang === l ? ACCENT : 'transparent',
                  color: activeLang === l ? '#fff' : '#666',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px',
                }}
              >
                {l === 'bhs' ? 'BHS' : 'EN'}
              </button>
            ))}
          </div>

          {/* Content tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '16px' }}>
            {(['content', 'seo'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: '8px 16px',
                  background: activeTab === t ? '#1c1c1c' : 'transparent',
                  color: activeTab === t ? '#f5f5f5' : '#555',
                  border: 'none', borderBottom: activeTab === t ? `2px solid ${ACCENT}` : '2px solid transparent',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                  fontWeight: activeTab === t ? 600 : 400,
                }}
              >
                {t === 'content' ? 'Sadržaj' : 'SEO'}
              </button>
            ))}
          </div>

          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
            {activeTab === 'content' && (
              <>
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Naslov</label>
                  <input
                    type="text"
                    value={langData.title}
                    onChange={(e) => activeLang === 'bhs' ? handleBhsTitleChange(e.target.value) : update([activeLang, 'title'], e.target.value)}
                    placeholder={activeLang === 'bhs' ? 'Naslov posta...' : 'Post title...'}
                    style={{ ...inputStyle, fontSize: '16px', fontWeight: 600 }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>
                    Kratki opis / Excerpt
                    <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>
                      ({langData.excerpt.length}/160)
                    </span>
                  </label>
                  <textarea
                    value={langData.excerpt}
                    onChange={(e) => update([activeLang, 'excerpt'], e.target.value)}
                    placeholder="Kratki opis koji se prikazuje u listingu..."
                    rows={3}
                    maxLength={160}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Sadržaj
                    <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0, marginLeft: '6px', fontFamily: 'JetBrains Mono, monospace' }}>HTML</span>
                  </label>
                  <textarea
                    value={langData.content}
                    onChange={(e) => update([activeLang, 'content'], e.target.value)}
                    placeholder="<p>Sadržaj blog posta...</p>"
                    rows={18}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.7 }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                  />
                </div>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>
                    Meta naslov
                    <span style={{ color: '#444', textTransform: 'none', marginLeft: '6px' }}>({blog.seo[activeLang].metaTitle.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={blog.seo[activeLang].metaTitle}
                    onChange={(e) => update(['seo', activeLang, 'metaTitle'], e.target.value)}
                    placeholder="SEO meta naslov..."
                    maxLength={60}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Meta opis
                    <span style={{ color: '#444', textTransform: 'none', marginLeft: '6px' }}>({blog.seo[activeLang].metaDescription.length}/160)</span>
                  </label>
                  <textarea
                    value={blog.seo[activeLang].metaDescription}
                    onChange={(e) => update(['seo', activeLang, 'metaDescription'], e.target.value)}
                    placeholder="SEO meta opis..."
                    rows={4}
                    maxLength={160}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Status */}
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '18px' }}>
            <label style={labelStyle}>Status</label>
            <button
              onClick={handlePublishToggle}
              style={{
                width: '100%', padding: '10px 14px',
                background: blog.status === 'published' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.1)',
                border: `1px solid ${blog.status === 'published' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
                borderRadius: '8px',
                color: blog.status === 'published' ? '#22c55e' : '#f59e0b',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {blog.status === 'published' ? <><Eye size={15} /> Objavljeno</> : <><EyeOff size={15} /> Draft</>}
            </button>
          </div>

          {/* Date */}
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '18px' }}>
            <label style={labelStyle}>Datum objave</label>
            <input
              type="date"
              value={blog.publishedAt ? blog.publishedAt.slice(0, 10) : ''}
              onChange={(e) => update(['publishedAt'], e.target.value ? new Date(e.target.value).toISOString() : null)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
              onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
            />
          </div>

          {/* Author + Category */}
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '18px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Autor</label>
              <input
                type="text"
                value={blog.author}
                onChange={(e) => update(['author'], e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
              />
            </div>
            <div>
              <label style={labelStyle}>Kategorija</label>
              <input
                type="text"
                value={blog.category}
                onChange={(e) => update(['category'], e.target.value)}
                placeholder="npr. Zdravlje, Savjeti..."
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
              />
            </div>
          </div>

          {/* Slug */}
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '18px' }}>
            <label style={labelStyle}>Slug (URL)</label>
            <input
              type="text"
              value={blog.slug}
              onChange={(e) => update(['slug'], e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="auto-generisan-iz-naslova"
              style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
              onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
              onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
            />
            {blog.slug && (
              <div style={{ marginTop: '6px', color: '#444', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                /blog/{blog.slug}
              </div>
            )}
          </div>

          {/* Cover image with Firebase Storage upload */}
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '18px' }}>
            <label style={labelStyle}>Cover slika (URL)</label>
            <input
              type="text"
              value={blog.coverImage}
              onChange={e => { update(['coverImage'], e.target.value); setImgError(false); }}
              placeholder="https://... ili /putanja/do/slike.jpg"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
              onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
            />
            {blog.coverImage && !imgError && (
              <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
                <img
                  src={blog.coverImage}
                  alt="cover"
                  style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', display: 'block' }}
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            {blog.coverImage && imgError && (
              <div style={{ marginTop: '6px', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                ⚠️ Slika se ne može učitati — provjeri URL
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
