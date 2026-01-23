'use client';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { RenderParameters } from 'pdfjs-dist/types/src/display/api';

interface PdfConverterOptions {
  scale?: number;
  quality?: number;
}

export async function pdfToWebpConverter(
  file: File,
  options: PdfConverterOptions = {},
): Promise<Blob[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  const pdfjsLib = await import('pdfjs-dist');
  const { scale = 2.0, quality = 0.8 } = options;
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    const conversionPromises = Array.from({ length: totalPages }, (_, i) =>
      renderPageToWebp(pdf, i + 1, scale, quality),
    );

    const results = await Promise.all(conversionPromises);

    return results.filter((blob): blob is Blob => blob !== null);
  } catch (error) {
    console.error('❌ PDF 변환 실패:', error);
    throw new Error('PDF 변환 중 오류가 발생했습니다.');
  }
}

async function renderPageToWebp(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale: number,
  quality: number,
): Promise<Blob | null> {
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext: RenderParameters = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(null);
          }
          canvas.width = 0;
          canvas.height = 0;
        },
        'image/webp',
        quality,
      );
    });
  } catch (error) {
    console.error(`${pageNumber}페이지 렌더링 실패:`, error);
    return null;
  }
}
