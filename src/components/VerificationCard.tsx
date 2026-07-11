import { useState } from 'react';
import { CheckCircle, AlertCircle, Edit2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { ExtractedFact } from '@/lib/types';

interface VerificationCardProps {
  title: string;
  item: ExtractedFact;
  onConfirm: (updated: ExtractedFact) => void;
}

export function VerificationCard({ 
  title, 
  item, 
  onConfirm 
}: VerificationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [editValue, setEditValue] = useState(JSON.stringify(item.value, null, 2));

  const confidenceColor = item.confidence > 85 ? 'text-green-500' : item.confidence > 60 ? 'text-yellow-500' : 'text-red-500';
  const ConfidenceIcon = item.confidence > 85 ? CheckCircle : AlertCircle;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editValue);
      setIsEditing(false);
      onConfirm({ ...item, value: parsed, verificationStatus: 'USER_CONFIRMED' });
      setIsConfirmed(true);
    } catch (e) {
      alert("Invalid JSON");
    }
  };

  const handleConfirm = () => {
    onConfirm({ ...item, verificationStatus: 'USER_CONFIRMED' });
    setIsConfirmed(true);
  };

  if (isConfirmed) return (
    <div className="p-3 mb-2 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 flex justify-between items-center opacity-70">
      <span className="text-sm font-medium">{title} Confirmed</span>
      <CheckCircle className="w-4 h-4 text-green-500" />
    </div>
  );

  return (
    <div className={`p-4 mb-4 border rounded-xl bg-card shadow-sm ${item.confidence < 60 ? 'border-red-200' : 'border-border'}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-primary">{title}</h3>
        <div className={`flex items-center text-xs font-medium ${confidenceColor}`}>
          <ConfidenceIcon className="w-4 h-4 mr-1" />
          {item.confidence}% Confidence
        </div>
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea 
            className="w-full h-32 p-2 text-sm border rounded bg-background font-mono"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleSave}><Check className="w-4 h-4 mr-1"/> Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-1"/> Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-sm bg-muted/30 p-3 rounded-lg overflow-auto max-h-40">
          <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify(item.value, null, 2)}</pre>
        </div>
      )}

      {item.sourceText && !isEditing && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Source Evidence:</p>
          <p className="text-xs italic bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-100 dark:border-yellow-900/50">"...{item.sourceText}..."</p>
        </div>
      )}

      {!isEditing && (
        <div className="flex justify-end gap-2 border-t pt-3">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            <CheckCircle className="w-3 h-3 mr-1" /> Confirm Fact
          </Button>
        </div>
      )}
    </div>
  );
}
