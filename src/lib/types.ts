export interface ExtractedFact {
  value: any;
  confidence: number;
  sourceText: string;
  verificationStatus: string;
}

export interface ExtractedData {
  basics?: ExtractedFact;
  summary?: ExtractedFact;
  experience?: ExtractedFact[];
  education?: ExtractedFact[];
  skills?: ExtractedFact[];
  projects?: ExtractedFact[];
  certifications?: ExtractedFact[];
}
