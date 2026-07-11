import { ExtractionAdapter } from './adapter';
import mammoth from 'mammoth';

export class LocalExtractionAdapter implements ExtractionAdapter {
  private async extractPdf(buffer: Buffer): Promise<string> {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
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
