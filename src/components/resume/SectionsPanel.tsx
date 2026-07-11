'use client';

import { useState } from 'react';
import type { ResumeContent } from '@/lib/ai/resume-schema';
import { Eye, EyeOff, GripVertical, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface SectionsPanelProps {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
}

const SECTION_LABELS: Record<string, string> = {
  contact: 'Contact Info',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  custom: 'Custom Section',
};

export function SectionsPanel({ content, onChange }: SectionsPanelProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = content.sections ?? [];

  const toggleVisibility = (index: number) => {
    const next = { ...content };
    next.sections = sections.map((s, i) =>
      i === index ? { ...s, visible: !s.visible } : s
    );
    onChange(next);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const next = { ...content };
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    next.sections = newSections;
    onChange(next);
  };

  // Design controls
  const updateDesign = (field: string, value: unknown) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section ordering */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-1 mb-2">
          Sections (drag to reorder)
        </div>
        {sections.map((section, index) => (
          <div
            key={`${section.type}-${index}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => { e.preventDefault(); setDropIndex(index); }}
            onDrop={() => {
              if (dragIndex !== null) moveSection(dragIndex, index);
              setDragIndex(null);
              setDropIndex(null);
            }}
            onDragEnd={() => { setDragIndex(null); setDropIndex(null); }}
            className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
              dropIndex === index ? 'border-primary/60 bg-primary/5' : 'border-transparent hover:border-muted hover:bg-muted/30'
            } ${!section.visible ? 'opacity-50' : ''}`}
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <span className="text-xs font-medium flex-1 truncate">
              {SECTION_LABELS[section.type] ?? section.type}
            </span>
            <button
              onClick={() => toggleVisibility(index)}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={section.visible ? 'Hide section' : 'Show section'}
            >
              {section.visible ? (
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground/40" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Design Controls */}
      <div className="border-t p-3 space-y-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Design
        </div>

        <div className="space-y-3">
          {/* Font size */}
          <div>
            <label className="text-xs text-muted-foreground flex justify-between">
              <span>Font Size</span>
              <span className="font-medium text-foreground">{content.fontSize ?? 10}pt</span>
            </label>
            <input
              type="range"
              min={8}
              max={14}
              step={0.5}
              value={content.fontSize ?? 10}
              onChange={e => updateDesign('fontSize', parseFloat(e.target.value))}
              className="w-full h-1.5 mt-1 accent-primary"
            />
          </div>

          {/* Line spacing */}
          <div>
            <label className="text-xs text-muted-foreground flex justify-between">
              <span>Line Spacing</span>
              <span className="font-medium text-foreground">{content.lineSpacing ?? 1.4}x</span>
            </label>
            <input
              type="range"
              min={1.1}
              max={2.0}
              step={0.05}
              value={content.lineSpacing ?? 1.4}
              onChange={e => updateDesign('lineSpacing', parseFloat(e.target.value))}
              className="w-full h-1.5 mt-1 accent-primary"
            />
          </div>

          {/* Template */}
          <div>
            <label className="text-xs text-muted-foreground">Template</label>
            <select
              value={content.templateId ?? 'clean'}
              onChange={e => updateDesign('templateId', e.target.value)}
              className="w-full mt-1 px-2 py-1.5 text-xs rounded-lg border bg-background"
            >
              <option value="clean">Clean (ATS Safe)</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
