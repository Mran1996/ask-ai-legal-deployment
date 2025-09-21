/**
 * Progress Bar Component
 * 
 * This component displays a progress bar with step information for multi-step processes.
 * It shows the current step, total steps, percentage completion, and step name.
 * 
 * Features:
 * - Visual progress indicator
 * - Step name display
 * - Percentage completion
 * - Smooth animations
 * - Accessible design
 * 
 * @param currentStep - Current step number (1-based)
 * @param totalSteps - Total number of steps (default: 5)
 * @returns A progress bar component with step information
 */

import React from "react";

// Step configuration for the progress bar
const STEP_CONFIG = {
  1: "Basic Information",
  2: "State Selection", 
  3: "Document Upload",
  4: "Chat with Khristian",
  5: "AI Document Generation",
} as const;

interface ProgressBarProps {
  /** Current step number (1-based indexing) */
  currentStep: number;
  /** Total number of steps in the process */
  totalSteps?: number;
}

export function ProgressBar({ currentStep, totalSteps = 5 }: ProgressBarProps) {
  // Calculate completion percentage
  const percentage = Math.min((currentStep / totalSteps) * 100, 100);
  
  // Get current step name
  const stepName = getStepName(currentStep);

  return (
    <div className="w-full px-4 mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {/* Progress information header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}: {stepName}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(percentage)}%
        </span>
      </div>
      
      {/* Progress bar container */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
          aria-label={`${percentage}% complete`}
        />
      </div>
    </div>
  );
}

/**
 * Get the name of a step by its number
 * 
 * @param step - Step number (1-5)
 * @returns Step name or empty string if step is not found
 */
function getStepName(step: number): string {
  return STEP_CONFIG[step as keyof typeof STEP_CONFIG] || "";
} 