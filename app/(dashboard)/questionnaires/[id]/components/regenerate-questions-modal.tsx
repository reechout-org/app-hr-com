"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RegenerateQuestionsModalProps {
  isOpen: boolean;
  isRegenerating: boolean;
  initialQuestionCount: number;
  onClose: () => void;
  onConfirm: (instructions: string, numQuestions: number) => void;
}

export function RegenerateQuestionsModal({ isOpen, isRegenerating, initialQuestionCount, onClose, onConfirm }: RegenerateQuestionsModalProps) {
  const [instructions, setInstructions] = useState("");
  const [numQuestions, setNumQuestions] = useState(initialQuestionCount || 5);

  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid set-state-in-effect warning
      const timer = setTimeout(() => {
        setInstructions("");
        setNumQuestions(initialQuestionCount > 0 ? initialQuestionCount : 5);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialQuestionCount]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isRegenerating && onClose()}>
      <DialogContent className="max-w-[600px] w-[95vw] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
        <DialogHeader className="border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] px-6 py-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            Regenerate Questions
          </DialogTitle>
          <DialogDescription className="sr-only">
            Provide instructions and select the number of questions to regenerate using AI.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Instructions
            </Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide feedback/context to guide regeneration (e.g. 'Focus more on technical skills instead of behavioral')"
              rows={4}
              className="w-full rounded-xl bg-[var(--surface-2)] border-[var(--border-color-light)] hover:border-[rgba(var(--primary-color-rgb),0.28)] dark:border-white/[0.09] focus-visible:ring-primary shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                <span className="text-destructive mr-1">*</span>
                Number of Questions
              </Label>
              <span className="text-sm font-medium text-primary">
                {numQuestions} questions
              </span>
            </div>
            <Slider
              value={[numQuestions]}
              min={2}
              max={15}
              step={1}
              onValueChange={(vals) => setNumQuestions(vals[0])}
              className="py-4"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] sm:justify-end gap-3">
          <Button
            variant="outline"
            disabled={isRegenerating}
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            disabled={isRegenerating}
            onClick={() => onConfirm(instructions, numQuestions)}
            className="h-10 rounded-xl px-4 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isRegenerating ? "Regenerating..." : "Regenerate Questions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
