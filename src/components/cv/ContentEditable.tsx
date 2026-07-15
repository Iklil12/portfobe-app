import React from 'react';

export function ContentEditable({ 
  value, 
  field, 
  onChange, 
  onFieldEdit,
  className 
}: { 
  value: string, 
  field?: string, 
  onChange?: (val: string) => void, 
  onFieldEdit?: (field: string, val: string) => void,
  className?: string 
}) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const val = e.currentTarget.textContent || "";
        if (onChange) onChange(val);
        else if (field && onFieldEdit) onFieldEdit(field, val);
      }}
      className={`outline-none hover:bg-black/5 focus:bg-black/5 focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1 transition-colors ${className || ''}`}
    >
      {value}
    </div>
  );
}
