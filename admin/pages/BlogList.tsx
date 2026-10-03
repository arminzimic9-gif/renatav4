import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, CheckCircle, FileText, Search } from 'lucide-react';
import { useAdminPanel } from '../context/AdminPanelContext';
import { Blog } from '../types';

const ACCENT = '#5392ce';

const statusBadge = (status: 'published' | 'draft') => ({
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
  fontFamily: 'DM Sans, sans-serif',
  background: status === 'published' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
  color: status === 'published' ? '#22c55e' : '#f59e0b',
  border: `1px solid ${status === 'published' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
} as React.CSSProperties);

export const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, loadBlogs, deleteBlog } = useAdminPanel();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const filtered = blogs.filter((b) => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = !search ||
      b.bhs.title.toLowerCase().includes(search.toLowerCase()) ||
      b.en.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj blog post?')) return;
    setDeleting(id);
    try {
      await deleteBlog(id);
    } finally {
      setDeleting(null);
    }
  };

  const published = blogs.filter((b) => b.status === 'published').length;
  const drafts = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#f5f5f5', fontSize: '26px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', margin: 0, letterSpacing: '-0.02em' }}>
            Blog postovi
          </h1>
          <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', marginTop: '5px', margin: '5px 0 0' }}>
            {published} objavljena · {drafts} draft · {blogs.length} ukupno
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: ACCENT, border: 'none', borderRadius: '10px',
            color: '#fff', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Novi blog post
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input
            type="text"
            placeholder="Pretraži blogove..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              background: '#141414', border: '1px solid #2a2a2a',
              borderRadius: '8px', color: '#f5f5f5',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        {(['all', 'published', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: filter === f ? ACCENT : '#141414',
              color: filter === f ? '#fff' : '#888',
              border: `1px solid ${filter === f ? ACCENT : '#2a2a2a'}`,
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
              fontWeight: filter === f ? 600 : 400, cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'Svi' : f === 'published' ? 'Objavljeni' : 'Draft'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '14px', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
            <FileText size={40} style={{ color: '#2a2a2a', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
            <p style={{ margin: 0, fontSize: '16px' }}>Nema blog postova.</p>
            <p style={{ margin: '8px 0 0', fontSize: '13px' }}>Kreirajte prvi post klikom na "Novi blog post".</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                {['Naslov', 'Autor', 'Kategorija', 'Status', 'Datum', 'Akcije'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    color: '#555', fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog, i) => (
                <tr
                  key={blog.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #1a1a1a' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, maxWidth: '280px' }}>
                      {blog.bhs.title || <span style={{ color: '#444', fontStyle: 'italic' }}>Bez naslova</span>}
                    </div>
                    {blog.en.title && (
                      <div style={{ color: '#555', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
                        EN: {blog.en.title}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#888', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                    {blog.author || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#888', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                    {blog.category || '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={statusBadge(blog.status)}>
                      {blog.status === 'published' ? '✓ Objavljeno' : '○ Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#555', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}>
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('bs') : '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => navigate(`/admin/blog/${blog.id}`)}
                        style={{ padding: '6px 12px', background: 'rgba(83,146,206,0.1)', border: 'none', borderRadius: '6px', color: ACCENT, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}
                      >
                        <Edit2 size={12} /> Uredi
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleting === blog.id}
                        style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
