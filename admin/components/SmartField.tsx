import React, { useState } from 'react';
import { Image, Link, ToggleLeft, Palette, Plus, Trash2, GripVertical } from 'lucide-react';
import { translations as defaultTranslations } from '../../translations';

const ACCENT = '#5392ce';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#0f0f0f',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#f5f5f5',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#888',
  fontSize: '12px',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 600,
  letterSpacing: '0.04em',
  marginBottom: '6px',
  textTransform: 'uppercase',
};

const URL_KEYS = ['url', 'link', 'href', 'src', 'image', 'img', 'photo', 'cover', 'coverimage'];
const LONG_TEXT_KEYS = ['description', 'text', 'content', 'bio', 'paragraph', 'body', 'excerpt', 'subtitle', 'a', 'intro', 'lead'];
const COLOR_KEYS = ['color', 'colour'];

function isUrlKey(key: string): boolean {
  return URL_KEYS.some((k) => key.toLowerCase().includes(k));
}

function isColorKey(key: string): boolean {
  return COLOR_KEYS.some((k) => key.toLowerCase().includes(k));
}

function isLongTextKey(key: string, value: string): boolean {
  if (LONG_TEXT_KEYS.some((k) => key.toLowerCase().includes(k))) return true;
  return value.length >= 100;
}

interface SmartFieldProps {
  fieldKey: string;
  value: any;
  path: string[];
  onUpdate: (path: string[], value: any) => void;
  depth?: number;
}

export const SmartField: React.FC<SmartFieldProps> = ({ fieldKey, value, path, onUpdate, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const [imgError, setImgError] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = ACCENT;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#2a2a2a';
  };

  // Null/undefined
  if (value === null || value === undefined) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>{fieldKey}</label>
        <input
          type="text"
          value=""
          onChange={(e) => onUpdate(path, e.target.value)}
          placeholder="(prazno)"
          style={fieldStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    );
  }

  // Boolean → Toggle
  if (typeof value === 'boolean') {
    return (
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{fieldKey}</label>
        <button
          onClick={() => onUpdate(path, !value)}
          style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: value ? ACCENT : '#2a2a2a',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <span style={{
            position: 'absolute', top: '3px',
            left: value ? '22px' : '3px',
            width: '18px', height: '18px',
            background: '#fff', borderRadius: '50%',
            transition: 'left 0.2s',
          }} />
        </button>
      </div>
    );
  }

  // Number
  if (typeof value === 'number') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>{fieldKey}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onUpdate(path, Number(e.target.value))}
          style={{ ...fieldStyle, fontFamily: 'JetBrains Mono, monospace' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    );
  }

  // Color field
  if (typeof value === 'string' && isColorKey(fieldKey)) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>{fieldKey}</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onUpdate(path, e.target.value)}
            style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #2a2a2a', cursor: 'pointer', background: 'none', padding: '2px' }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onUpdate(path, e.target.value)}
            style={{ ...fieldStyle, fontFamily: 'JetBrains Mono, monospace', flex: 1 }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>
    );
  }

  // URL / Image field
  if (typeof value === 'string' && isUrlKey(fieldKey)) {
    const isImage = ['image', 'img', 'photo', 'cover', 'coverimage'].some((k) => fieldKey.toLowerCase().includes(k));
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isImage ? <Image size={12} /> : <Link size={12} />}
            {fieldKey}
          </span>
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => { onUpdate(path, e.target.value); setImgError(false); }}
          placeholder="https://..."
          style={fieldStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isImage && value && !imgError && (
          <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a', maxHeight: '140px' }}>
            <img
              src={value}
              alt="preview"
              onError={() => setImgError(true)}
              style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
        {isImage && imgError && (
          <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
            ⚠️ Slika se ne može učitati. Provjerite URL.
          </div>
        )}
      </div>
    );
  }

  // Long string → textarea
  if (typeof value === 'string' && isLongTextKey(fieldKey, value)) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>{fieldKey}</label>
        <textarea
          value={value}
          onChange={(e) => onUpdate(path, e.target.value)}
          rows={Math.min(Math.max(Math.ceil(value.length / 80), 3), 10)}
          style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div style={{ textAlign: 'right', color: '#444', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', marginTop: '3px' }}>
          {value.length} znakova
        </div>
      </div>
    );
  }

  // Short string → input
  if (typeof value === 'string') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>{fieldKey}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onUpdate(path, e.target.value)}
          style={fieldStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    );
  }

  // Array of strings
  if (Array.isArray(value) && value.every((i) => typeof i === 'string')) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={labelStyle}>{fieldKey} <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>({value.length} stavki)</span></label>
          <button
            onClick={() => onUpdate(path, [...value, ''])}
            style={{ color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={12} /> Dodaj
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {value.map((item: string, idx: number) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#444', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', minWidth: '20px' }}>{idx + 1}</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...value];
                  next[idx] = e.target.value;
                  onUpdate(path, next);
                }}
                style={{ ...fieldStyle, flex: 1 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                onClick={() => onUpdate(path, value.filter((_: any, i: number) => i !== idx))}
                style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Array of objects
  if (Array.isArray(value)) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%', textAlign: 'left',
            background: '#0f0f0f', border: '1px solid #2a2a2a',
            borderRadius: expanded ? '8px 8px 0 0' : '8px',
            padding: '10px 14px',
            color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: ACCENT }}>[ ]</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '12px', color: '#888' }}>{fieldKey}</span>
          </span>
          <span style={{ color: '#444', fontSize: '12px', fontWeight: 400 }}>{value.length} stavki · {expanded ? '▲' : '▼'}</span>
        </button>

        {expanded && (
          <div style={{ border: '1px solid #2a2a2a', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px', background: '#0d0d0d' }}>
            {value.map((item: any, idx: number) => (
              <div key={idx} style={{ marginBottom: '16px', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  background: '#141414', padding: '8px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ color: '#888', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                    [{idx}] {typeof item === 'object' && item !== null ? (item.title || item.q || item.author || item.label || '') : ''}
                  </span>
                  <button
                    onClick={() => onUpdate(path, value.filter((_: any, i: number) => i !== idx))}
                    style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ padding: '12px' }}>
                  {typeof item === 'object' && item !== null
                    ? Object.keys(item).map((childKey) => (
                      <SmartField
                        key={childKey}
                        fieldKey={childKey}
                        value={item[childKey]}
                        path={[...path, idx.toString(), childKey]}
                        onUpdate={onUpdate}
                        depth={depth + 1}
                      />
                    ))
                    : (
                      <input
                        type="text"
                        value={String(item)}
                        onChange={(e) => {
                          const next = [...value];
                          next[idx] = e.target.value;
                          onUpdate(path, next);
                        }}
                        style={fieldStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    )
                  }
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                let template: any = '';
                if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                  template = Object.fromEntries(
                    Object.keys(value[0]).map((k) => [
                      k,
                      typeof value[0][k] === 'number' ? 0 : typeof value[0][k] === 'boolean' ? false : Array.isArray(value[0][k]) ? [] : ''
                    ])
                  );
                } else if (value.length === 0) {
                  let cur: any = defaultTranslations;
                  for (const p of path) {
                    if (cur) cur = cur[p];
                  }
                  if (Array.isArray(cur) && cur.length > 0 && typeof cur[0] === 'object' && cur[0] !== null) {
                    template = Object.fromEntries(
                      Object.keys(cur[0]).map((k) => [
                        k,
                        typeof cur[0][k] === 'number' ? 0 : typeof cur[0][k] === 'boolean' ? false : Array.isArray(cur[0][k]) ? [] : ''
                      ])
                    );
                  }
                }
                onUpdate(path, [...value, template]);
              }}
              style={{
                width: '100%', padding: '9px',
                background: 'transparent', border: '1px dashed #2a2a2a',
                borderRadius: '8px', color: ACCENT,
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
            >
              <Plus size={14} /> Dodaj stavku
            </button>
          </div>
        )}
      </div>
    );
  }

  // Object → nested
  if (typeof value === 'object' && value !== null) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%', textAlign: 'left',
            background: '#0f0f0f', border: '1px solid #2a2a2a',
            borderRadius: expanded ? '8px 8px 0 0' : '8px',
            padding: '10px 14px',
            color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#888' }}>{ }</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '12px', color: '#888' }}>{fieldKey}</span>
          </span>
          <span style={{ color: '#444', fontSize: '12px', fontWeight: 400 }}>{Object.keys(value).length} polja · {expanded ? '▲' : '▼'}</span>
        </button>
        {expanded && (
          <div style={{ border: '1px solid #2a2a2a', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '16px', background: '#0d0d0d' }}>
            {Object.keys(value).map((childKey) => (
              <SmartField
                key={childKey}
                fieldKey={childKey}
                value={value[childKey]}
                path={[...path, childKey]}
                onUpdate={onUpdate}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};
