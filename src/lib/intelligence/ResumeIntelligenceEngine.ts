import { LocalExtractionAdapter } from '@/lib/extraction/local-adapter';

export class ResumeIntelligenceEngine {
  static async parse(buffer: Buffer, mimeType: string) {
    const adapter = new LocalExtractionAdapter();
    const rawText = await adapter.extract(buffer, mimeType);
    
    // Deterministic Native Extraction
    const facts = {
      basics: this.extractBasics(rawText),
      skills: this.extractSkills(rawText),
      experiences: this.extractExperiences(rawText),
      educations: this.extractEducation(rawText),
      projects: this.extractProjects(rawText),
      certifications: []
    };

    return {
      parsedData: facts,
      rawText
    };
  }

  private static extractBasics(text: string) {
    // Regex for Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    // Regex for Phone (basic international/US)
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Basic Name Extraction: Usually the first line with letters.
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const nameMatch = lines.find(l => /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l));

    return {
      name: nameMatch || null,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
    };
  }

  private static extractSkills(text: string) {
    // A primitive local dictionary for the Native Engine
    const techDictionary = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
      'Java', 'C++', 'SQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS',
      'GCP', 'Azure', 'Machine Learning', 'AI', 'Tailwind', 'Prisma', 'MongoDB',
      'Redis', 'GraphQL', 'REST'
    ];

    const foundSkills = [];
    for (const skill of techDictionary) {
      // Case insensitive word boundary match
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        foundSkills.push({ name: skill, level: 'Intermediate', yearsOfExperience: 0 });
      }
    }

    return foundSkills;
  }

  private static extractExperiences(text: string) {
    const experiences = [];
    const lowerText = text.toLowerCase();
    
    // Simplistic heuristic: Look for date ranges "2020 - Present", "Jan 2019 to Mar 2021"
    const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4} (?:-|to) (?:Present|Current|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4})\b/ig;
    
    let match;
    while ((match = dateRegex.exec(text)) !== null) {
      experiences.push({
        company: "Extracted Company",
        role: "Extracted Role",
        startDate: match[0].split(' - ')[0] || null,
        endDate: match[0].split(' - ')[1] || null,
        description: "Experience bullet points pending native classification.",
        highlights: []
      });
    }

    // Limit to 5 to avoid noise
    return experiences.slice(0, 5);
  }

  private static extractEducation(text: string) {
    const educations = [];
    if (text.toLowerCase().includes('bachelor') || text.toLowerCase().includes('bs') || text.toLowerCase().includes('b.s')) {
      educations.push({
        institution: "University",
        degree: "Bachelor's Degree",
        fieldOfStudy: "Computer Science (Inferred)",
      });
    }
    if (text.toLowerCase().includes('master') || text.toLowerCase().includes('ms') || text.toLowerCase().includes('m.s')) {
      educations.push({
        institution: "University",
        degree: "Master's Degree",
        fieldOfStudy: "Computer Science (Inferred)",
      });
    }
    return educations;
  }

  private static extractProjects(text: string) {
    return []; // Native project extraction is complex, returning empty for baseline
  }
}
