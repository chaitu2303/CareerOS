import { ExtractionAdapter } from './adapter';
import mammoth from 'mammoth';
export class LocalExtractionAdapter implements ExtractionAdapter {
  private async extractPdf(buffer: Buffer): Promise<string> {
    const PDFParser = require('pdf2json');
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });
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
