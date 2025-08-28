// frontend/src/components/Exercise/CodeEditor.tsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  theme = 'dark',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      
      // Reset cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative rounded-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      style={{ height }}
    >
      {/* Line numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 dark:bg-gray-950 text-gray-500 text-sm font-mono p-4 select-none">
        {code.split('\n').map((_, index) => (
          <div key={index} className="leading-6">
            {index + 1}
          </div>
        ))}
      </div>

      {/* Code textarea */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        className={`
          w-full h-full pl-16 pr-4 py-4
          font-mono text-sm leading-6
          resize-none outline-none
          ${theme === 'dark' 
            ? 'bg-gray-900 text-gray-100' 
            : 'bg-gray-50 text-gray-900'}
          ${readOnly ? 'cursor-not-allowed' : ''}
        `}
        style={{
          tabSize: 2,
        }}
        placeholder="// Write your code here..."
      />

      {/* Language badge */}
      <div className="absolute top-2 right-2">
        <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
          {language}
        </span>
      </div>
    </motion.div>
  );
};

// Add default export
export default CodeEditor;