
import React, { useState, useCallback } from 'react';
import { analyzeCreditReport } from './services/geminiService';
import type { CreditReportData } from './types';
import FileUpload from './components/FileUpload';
import JsonDisplay from './components/JsonDisplay';
import Loader from './components/Loader';
import { BotIcon, SparklesIcon } from './components/Icons';

export default function App() {
  const [reportText, setReportText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<CreditReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((content: string, name: string) => {
    setReportText(content);
    setFileName(name);
    setJsonData(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!reportText) {
      setError('Please upload a credit report file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setJsonData(null);

    try {
      const result = await analyzeCreditReport(reportText);
      setJsonData(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze the credit report. The AI may have been unable to process the format. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BotIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
              Credit Report AI Analyzer
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your credit report as a text file to instantly extract key financial data into a structured JSON format.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 backdrop-blur-sm border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-slate-200">1. Upload Report</h2>
              <FileUpload onFileSelect={handleFileSelect} />
              {fileName && <p className="text-sm text-slate-400 text-center">Selected: <span className="font-medium text-slate-300">{fileName}</span></p>}
              
              <div className="mt-4">
                 <h2 className="text-xl font-semibold text-slate-200 mb-4">2. Analyze</h2>
                <button
                  onClick={handleAnalyze}
                  disabled={!reportText || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Extract Key Information
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-slate-200">3. Get Structured JSON</h2>
              <div className="bg-slate-900/70 rounded-lg border border-slate-700 min-h-[280px] p-4 flex items-center justify-center">
                {isLoading && (
                  <div className="text-center text-slate-400">
                    <Loader className="w-8 h-8 mx-auto mb-2" />
                    <p>AI is processing your report...</p>
                  </div>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                {jsonData && <JsonDisplay data={jsonData} />}
                {!isLoading && !error && !jsonData && (
                  <p className="text-slate-500 text-center">Your JSON output will appear here.</p>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center mt-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI Financial Tools. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
