'use client';

import type { ResumeContent } from '@/lib/ai/resume-schema';

interface ResumePreviewProps {
  content: ResumeContent;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  const sections = content?.sections ?? [];
  const contact = sections.find(s => s.type === 'contact');
  const summary = sections.find(s => s.type === 'summary');
  const experience = sections.find(s => s.type === 'experience');
  const education = sections.find(s => s.type === 'education');
  const skills = sections.find(s => s.type === 'skills');
  const projects = sections.find(s => s.type === 'projects');
  const certs = sections.find(s => s.type === 'certifications');

  const margins = content?.margins ?? { top: 20, bottom: 20, left: 20, right: 20 };
  const fontSize = content?.fontSize ?? 10;
  const lineSpacing = content?.lineSpacing ?? 1.4;

  const sectionHeader = (title: string) => (
    <div className="mb-2">
      <h2
        className="font-bold text-gray-900 uppercase tracking-wider border-b border-gray-800"
        style={{ fontSize: `${fontSize + 1}px`, paddingBottom: '2px', marginBottom: '6px' }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div
      className="bg-white shadow-xl w-full print:shadow-none"
      style={{
        fontFamily: content?.font ?? 'Inter, sans-serif',
        fontSize: `${fontSize}px`,
        lineHeight: lineSpacing,
        padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
        minHeight: '297mm',
      }}
      id="resume-preview"
    >
      {/* Contact Header */}
      {contact?.visible && contact.type === 'contact' && (
        <div className="text-center mb-5">
          <h1
            className="font-bold text-gray-900"
            style={{ fontSize: `${fontSize + 10}px`, marginBottom: '4px' }}
          >
            {contact.data.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-gray-600" style={{ fontSize: `${fontSize - 1}px` }}>
            {contact.data.email && <span>{contact.data.email}</span>}
            {contact.data.phone && <><span>·</span><span>{contact.data.phone}</span></>}
            {contact.data.location && <><span>·</span><span>{contact.data.location}</span></>}
            {contact.data.linkedinUrl && <><span>·</span><span className="text-blue-600">{contact.data.linkedinUrl.replace('https://', '')}</span></>}
            {contact.data.githubUrl && <><span>·</span><span className="text-blue-600">{contact.data.githubUrl.replace('https://', '')}</span></>}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary?.visible && summary.type === 'summary' && summary.data.text && (
        <div className="mb-4">
          {sectionHeader('Summary')}
          <p className="text-gray-700" style={{ fontSize: `${fontSize}px` }}>{summary.data.text}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.visible && experience.type === 'experience' && experience.data.items.length > 0 && (
        <div className="mb-4">
          {sectionHeader('Experience')}
          <div className="space-y-3">
            {experience.data.items.map((item, i) => (
              <div key={item.id ?? i}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{item.role}</div>
                    <div className="text-gray-600 italic">{item.company}</div>
                  </div>
                  {item.duration && (
                    <div className="text-gray-500 text-right shrink-0 ml-2" style={{ fontSize: `${fontSize - 1}px` }}>
                      {item.duration}
                    </div>
                  )}
                </div>
                {item.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {item.bullets.map((b, bi) => (
                      <li key={bi} className="text-gray-700" style={{ fontSize: `${fontSize}px` }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.visible && education.type === 'education' && education.data.items.length > 0 && (
        <div className="mb-4">
          {sectionHeader('Education')}
          <div className="space-y-2">
            {education.data.items.map((item, i) => (
              <div key={item.id ?? i} className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900">{item.degree}{item.field ? ` in ${item.field}` : ''}</div>
                  <div className="text-gray-600">{item.institution}</div>
                  {item.gpa && <div className="text-gray-500" style={{ fontSize: `${fontSize - 1}px` }}>GPA: {item.gpa}</div>}
                </div>
                {item.year && (
                  <div className="text-gray-500 shrink-0 ml-2" style={{ fontSize: `${fontSize - 1}px` }}>{item.year}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills?.visible && skills.type === 'skills' && skills.data.groups.length > 0 && (
        <div className="mb-4">
          {sectionHeader('Skills')}
          <div className="space-y-1">
            {skills.data.groups.map((group, i) => (
              <div key={i} className="flex gap-2">
                <span className="font-semibold text-gray-900 shrink-0" style={{ fontSize: `${fontSize}px` }}>{group.category}:</span>
                <span className="text-gray-700" style={{ fontSize: `${fontSize}px` }}>{group.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.visible && projects.type === 'projects' && projects.data.items.length > 0 && (
        <div className="mb-4">
          {sectionHeader('Projects')}
          <div className="space-y-3">
            {projects.data.items.map((project, i) => (
              <div key={project.id ?? i}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{project.name}</span>
                  {project.techStack && project.techStack.length > 0 && (
                    <span className="text-gray-500 italic" style={{ fontSize: `${fontSize - 1}px` }}>
                      [{project.techStack.join(', ')}]
                    </span>
                  )}
                  {project.url && (
                    <span className="text-blue-600" style={{ fontSize: `${fontSize - 1}px` }}>{project.url}</span>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 mt-0.5">{project.description}</p>
                )}
                {project.bullets && project.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {project.bullets.map((b, bi) => (
                      <li key={bi} className="text-gray-700">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certs?.visible && certs.type === 'certifications' && certs.data.items.length > 0 && (
        <div className="mb-4">
          {sectionHeader('Certifications')}
          <div className="space-y-1">
            {certs.data.items.map((cert, i) => (
              <div key={cert.id ?? i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                </div>
                {cert.year && (
                  <span className="text-gray-500 shrink-0 ml-2" style={{ fontSize: `${fontSize - 1}px` }}>{cert.year}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.filter(s => s.visible).length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          Add sections to see your resume preview.
        </div>
      )}
    </div>
  );
}
