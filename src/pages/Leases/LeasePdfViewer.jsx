import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';

const LeasePdfViewer = ({ pdfUrl, showTextInline = false }) => {
  const [allText, setAllText] = useState('');
  const [lastPageText, setLastPageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setAllText('');
    setLastPageText('');
    if (!pdfUrl) return;

    const fetchAndExtract = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        let allPagesText = '';
        let lastPageTextLocal = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          allPagesText += pageText + '\n\n';
          if (i === pdf.numPages) {
            lastPageTextLocal = pageText;
          }
        }
        if (isMounted) {
          setAllText(allPagesText.trim());
          setLastPageText(lastPageTextLocal.trim());
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load or parse PDF.');
          setLoading(false);
        }
      }
    };
    fetchAndExtract();
    return () => { isMounted = false; };
  }, [pdfUrl]);

  if (showTextInline) {
    return (
      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
        <h4 className="font-semibold mb-1">PDF Agreement Text</h4>
        {loading ? (
          <span className="text-gray-500">Loading PDF text...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <span className="text-sm whitespace-pre-line">{allText || 'No text found in PDF.'}</span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-1">Lease PDF</h3>
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open PDF in new tab</a>
      <div className="mt-2 border rounded overflow-hidden" style={{height:'350px'}}>
        <iframe src={pdfUrl} title="Lease PDF" width="100%" height="100%" />
      </div>
      <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
        <h4 className="font-semibold mb-1">All PDF Text</h4>
        {loading ? (
          <span className="text-gray-500">Loading PDF text...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <span className="text-sm whitespace-pre-line">{allText || 'No text found in PDF.'}</span>
        )}
      </div>
      <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
        <h4 className="font-semibold mb-1">Last Page Text</h4>
        {loading ? (
          <span className="text-gray-500">Loading last page text...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <span className="text-sm whitespace-pre-line">{lastPageText || 'No text found on last page.'}</span>
        )}
      </div>
    </div>
  );
};

export default LeasePdfViewer;
