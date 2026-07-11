const fs = require('fs');
const path = require('path');

const stubs = [
  ['resumes', 'AI Resume Studio', 'Create and tailor job-specific resumes powered by your Master Career Profile.', 'Milestone 5'],
  ['resumes/new', 'New Resume', 'Start building a new resume from your Master Career Profile.', 'Milestone 5'],
  ['applications', 'Application Tracker', 'Track your job applications from saved to offer.', 'Milestone 14'],
  ['assess', 'Assessment Arena', 'Practice aptitude, technical, and domain-specific assessments.', 'Milestone 7'],
  ['code', 'Coding Arena', 'Practice coding challenges with AI-powered feedback.', 'Milestone 8'],
  ['interview', 'AI Mock Interview', 'Simulate real interviews across departments, roles, and interview types.', 'Milestone 10'],
  ['interview/new', 'Start New Interview', 'Configure and begin your AI mock interview session.', 'Milestone 10'],
  ['analytics', 'Career Performance Center', 'Track your career readiness, skill mastery, interview progress and more.', 'Milestone 17'],
  ['achievements', 'Achievements & Badges', 'View earned badges, certificates, and XP history.', 'Milestone 16'],
  ['learn', 'Learning Paths', 'Follow domain-specific learning tracks to reach job-readiness.', 'Milestone 9'],
  ['tools', 'Document Tools', 'PDF, image and photo utilities for your career documents.', 'Milestone 18'],
  ['notifications', 'Notifications', 'Stay updated on your missions, badges, reports and more.', 'Milestone 19'],
];

const base = path.join('e:', 'Ai Job Tracer', 'careeros', 'src', 'app', 'dashboard');

stubs.forEach(([route, title, desc, ms]) => {
  const dir = path.join(base, route);
  const file = path.join(dir, 'page.tsx');
  if (!fs.existsSync(file)) {
    fs.mkdirSync(dir, { recursive: true });
    const content = [
      "import { ComingSoon } from '@/components/ui/ComingSoon';",
      "",
      "export default function Page() {",
      "  return (",
      "    <ComingSoon",
      `      title="${title}"`,
      `      description="${desc}"`,
      `      milestone="${ms}"`,
      "    />",
      "  );",
      "}",
      ""
    ].join('\n');
    fs.writeFileSync(file, content);
    console.log('Created:', route);
  } else {
    console.log('Exists (skipped):', route);
  }
});
