"use client"

import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

interface GenerateCaseAnalysisButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function GenerateCaseAnalysisButton({ onClick, disabled }: GenerateCaseAnalysisButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <BarChart3 className="mr-2 h-4 w-4" />
      {disabled ? 'Generating...' : 'Generate AI Case Analysis'}
    </Button>
  );
} 