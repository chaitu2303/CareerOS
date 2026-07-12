import { EvidenceGroundingEngine } from './EvidenceGroundingEngine';
import { ResumeIntelligenceEngine } from './ResumeIntelligenceEngine';
import { JobIntelligenceEngine } from './JobIntelligenceEngine';
import { ATSIntelligenceEngine } from './ATSIntelligenceEngine';
import { CareerRecommendationEngine } from './CareerRecommendationEngine';
import { InterviewQuestionEngine } from './InterviewQuestionEngine';

export class CareerIntelligenceEngine {
  static Grounding = EvidenceGroundingEngine;
  static Resume = ResumeIntelligenceEngine;
  static Job = JobIntelligenceEngine;
  static ATS = ATSIntelligenceEngine;
  static Recommendations = CareerRecommendationEngine;
  static Interview = InterviewQuestionEngine;
}
