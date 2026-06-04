"use client";

import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  field: string;
  entity: string;
  isEditor?: boolean;
  className?: string;
  as?: any;
  maxLength?: number;
}

import DOMPurify from 'isomorphic-dompurify';

// Fungsi untuk membersihkan teks secara aman menggunakan DOMPurify
const sanitizeText = (text: string) => {
  if (!text) return "";
  
  // Konfigurasi DOMPurify: Hanya izinkan tag teks dasar jika diinginkan
  // (saat ini kita biarkan kosong agar berfungsi layaknya plain text murni
  // namun tetap membersihkan struktur XSS)
  const clean = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [], // Kosongkan jika kita hanya ingin teks biasa tanpa formatting
    ALLOWED_ATTR: []
  });
  
  return clean
    // Hapus Emoji jika tetap ingin menjaga gaya brutalist/clean
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
};

export function EditableText({ value, field, entity, isEditor, className = "", as: Component = "span", maxLength }: EditableTextProps) {
  const [content, setContent] = useState(() => sanitizeText(value || ""));
  const elementRef = useRef<any>(null);

  useEffect(() => {
    setContent(sanitizeText(value || ""));
  }, [value]);

  const handleBlur = () => {
    let rawText = elementRef.current?.innerText || "";
    let newText = sanitizeText(rawText).trim();

    if (maxLength && newText.length > maxLength) {
      newText = newText.substring(0, maxLength);
    }

    elementRef.current.innerText = newText;

    if (newText !== value && newText !== "") {
      setContent(newText);
      // Kirim pesan ke parent window
      if (window.parent) {
        window.parent.postMessage({
          type: 'INLINE_EDIT',
          entity,
          field,
          value: newText
        }, '*');
      }
    } else if (newText === "") {
      // Revert if empty
      setContent(value);
      if (elementRef.current) {
        elementRef.current.innerText = value;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Component !== 'p') {
      e.preventDefault();
      elementRef.current?.blur();
      return;
    }

    // Prevent typing if length exceeds maxLength
    if (maxLength && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
      const currentText = elementRef.current?.innerText || "";
      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().length > 0;
      if (currentText.length >= maxLength && !hasSelection) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const rawText = e.clipboardData.getData('text/plain');
    const cleanText = sanitizeText(rawText);

    const currentText = elementRef.current?.innerText || "";
    const selection = window.getSelection();
    const selectionLength = selection ? selection.toString().length : 0;

    let allowedLength = cleanText.length;
    if (maxLength) {
      allowedLength = maxLength - (currentText.length - selectionLength);
    }

    if (allowedLength <= 0) return;

    const textToInsert = cleanText.slice(0, allowedLength);
    document.execCommand('insertText', false, textToInsert);
  };

  const handleInput = () => {
    if (!elementRef.current) return;
    const rawText = elementRef.current.innerText || "";
    const cleanText = sanitizeText(rawText);
    let finalText = cleanText;

    if (maxLength && cleanText.length > maxLength) {
      finalText = cleanText.substring(0, maxLength);
    }

    if (rawText !== finalText) {
      elementRef.current.innerText = finalText;

      // Kembalikan kursor ke posisi akhir teks
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(elementRef.current);
        range.collapse(false); // false = letakkan di akhir
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  if (!isEditor) {
    return <Component className={`break-words break-all [word-break:break-word] whitespace-pre-wrap ${className}`} style={{ fontFamily: 'inherit' }}>{content}</Component>;
  }

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      className={`outline-none cursor-text transition-all hover:shadow-[0_0_0_1px_#007bff] focus:shadow-[0_0_0_1px_#007bff] focus:bg-[#007bff]/5 rounded-[2px] break-words break-all [word-break:break-word] whitespace-pre-wrap ${className}`}
      style={{ fontFamily: 'inherit' }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      onClick={(e: any) => {
        if (isEditor) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      title={`Klik untuk mengedit${maxLength ? ` (Maksimal ${maxLength} karakter)` : ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
