
import React, { useState, useEffect } from 'react';
import type { CreditReportData } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface JsonDisplayProps {
  data: CreditReportData;
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  const [isCopied, setIsCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setIsCopied(true);
    });
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="relative w-full h-full text-left">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-slate-700/80 hover:bg-slate-600 rounded-md transition-all duration-200 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Copy JSON to clipboard"
      >
        {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
      </button>
      <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words overflow-auto h-[280px] p-1 text-cyan-300 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
};

export default JsonDisplay;
