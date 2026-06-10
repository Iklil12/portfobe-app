"use client";

import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  field?: string;
  entity?: string;
  isEditor?: boolean;
  className?: string;
  as?: any;
  maxLength?: number;
  href?: string;
  onChange?: (newText: string) => void;
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

export function EditableText({ value, field, entity, isEditor, className = "", as: Component = "span", maxLength, href, onChange }: EditableTextProps) {
  
  // Tentukan batas karakter cerdas berdasarkan jenis field
  let activeMaxLength = maxLength;
  
  // OVERRIDE: Data Profil selalu mengikuti aturan mutlak (mengabaikan limit dari tema)
  if (entity === 'profile') {
    if (field === 'fullName' || field === 'firstName' || field === 'lastName') {
      activeMaxLength = 10;
    } else if (field === 'profession') {
      activeMaxLength = 20;
    } else if (field === 'location') {
      activeMaxLength = 40;
    } else if (field === 'bio') {
      activeMaxLength = 250;
    }
  } else if (!activeMaxLength) {
    // Jika bukan data profil dan tidak ada maxLength eksplisit dari tema, gunakan default statis
    activeMaxLength = 150;
  }

  const [content, setContent] = useState(() => sanitizeText(value || ""));
  const elementRef = useRef<any>(null);

  useEffect(() => {
    setContent(sanitizeText(value || ""));
  }, [value]);

  const handleBlur = () => {
    let rawText = elementRef.current?.innerText || "";
    let newText = sanitizeText(rawText).trim();

    if (activeMaxLength && newText.length > activeMaxLength) {
      newText = newText.substring(0, activeMaxLength);
    }

    elementRef.current.innerText = newText;

    if (newText !== value && newText !== "") {
      setContent(newText);
      if (onChange) {
        onChange(newText);
      } else if (window.parent && field && entity) {
        window.parent.postMessage({
          type: 'INLINE_EDIT',
          entity,
          field,
          value: newText
        }, window.location.origin);
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

    // Prevent typing if length exceeds activeMaxLength
    if (activeMaxLength && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
      const currentText = elementRef.current?.innerText || "";
      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().length > 0;
      if (currentText.length >= activeMaxLength && !hasSelection) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const rawText = e.clipboardData.getData('text/plain');
    let cleanText = sanitizeText(rawText);

    // Mencegah paste multi-baris (newline) pada elemen inline seperti span/h1/h2
    if (Component !== 'p' && Component !== 'div') {
      cleanText = cleanText.replace(/\r?\n|\r/g, ' ');
    }

    const currentText = elementRef.current?.innerText || "";
    const selection = window.getSelection();
    const selectionLength = selection ? selection.toString().length : 0;

    let allowedLength = cleanText.length;
    if (activeMaxLength) {
      allowedLength = activeMaxLength - (currentText.length - selectionLength);
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

    if (activeMaxLength && cleanText.length > activeMaxLength) {
      finalText = cleanText.substring(0, activeMaxLength);
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
    return <Component href={href} className={`break-words break-all [word-break:break-word] whitespace-pre-wrap ${className}`} style={{ fontFamily: 'inherit' }}>{content}</Component>;
  }

  return (
    <Component
      href={href}
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
      title={`Klik untuk mengedit${activeMaxLength ? ` (Maksimal ${activeMaxLength} karakter)` : ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
