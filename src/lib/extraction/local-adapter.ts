import { ExtractionAdapter } from './adapter';
import mammoth from 'mammoth';

export class LocalExtractionAdapter implements ExtractionAdapter {
  private async extractPdf(buffer: Buffer): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      // Use standard fonts if needed
      standardFontDataUrl: 'node_modules/pdfjs-dist/standard_fonts/',
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
    }
    
    return fullText;
  }

  async extract(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === 'application/pdf') {
      return this.extractPdf(buffer);
    }

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    throw new Error(`Unsupported mimeType for LocalExtractionAdapter: ${mimeType}`);
  }
}
