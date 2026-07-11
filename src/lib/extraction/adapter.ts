export interface ExtractionAdapter {
  extract(buffer: Buffer, mimeType: string): Promise<string>;
}
