"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question } from "@/lib/api/questionnaires";

interface QuestionModalProps {
  isOpen: boolean;
  isSaving: boolean;
  question: Partial<Question> | null;
  activeTab: "screening" | "regular";
  onClose: () => void;
  onSave: (data: Partial<Question>) => void;
}

const QUESTION_TYPES = [
  { label: "Behavioral", value: "behavioral" },
  { label: "Technical", value: "technical" },
  { label: "Cultural Value", value: "cultural_value" },
];

export function QuestionModal({ isOpen, isSaving, question, activeTab, onClose, onSave }: QuestionModalProps) {
  const [formData, setFormData] = useState<Partial<Question>>({
    question_text: "",
    order: 1,
    question_type: "behavioral"
  });

  useEffect(() => {
    if (isOpen && question) {
      const timer = setTimeout(() => setFormData({
        ...question,
        question_type: activeTab === "screening" ? "screening" : (question.question_type || "behavioral")
      }), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, question, activeTab]);

  const isValid = !!formData.question_text?.trim() && !!formData.order;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="max-w-[600px] w-[95vw] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
        <DialogHeader className="border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] px-6 py-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            {question?.id ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Add or edit a question in this questionnaire.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Question Type</Label>
            {activeTab === "screening" ? (
              <>
                <Select value="screening" disabled>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/50 border-border focus:ring-primary shadow-sm text-muted-foreground opacity-100">
                    <SelectValue placeholder="Application" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screening">Application</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Application questions are used for initial candidate evaluation</p>
              </>
            ) : (
              <Select 
                value={formData.question_type} 
                onValueChange={(val) => setFormData({...formData, question_type: val})}
              >
                <SelectTrigger className="h-10 rounded-xl bg-[var(--surface-2)] border-[var(--border-color-light)] hover:border-[rgba(var(--primary-color-rgb),0.28)] dark:border-white/[0.09] focus:ring-primary shadow-sm">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Question Text</Label>
            <Textarea
              value={formData.question_text}
              onChange={(e) => setFormData({...formData, question_text: e.target.value})}
              placeholder="Enter your question here..."
              rows={3}
              className="w-full rounded-xl bg-[var(--surface-2)] border-[var(--border-color-light)] hover:border-[rgba(var(--primary-color-rgb),0.28)] dark:border-white/[0.09] focus-visible:ring-primary shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Question Order</Label>
            <Input
              type="number"
              value={formData.order || ""}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value, 10) || 0})}
              placeholder="Enter question order"
              className="h-10 w-full rounded-xl bg-[var(--surface-2)] border-[var(--border-color-light)] hover:border-[rgba(var(--primary-color-rgb),0.28)] dark:border-white/[0.09] focus-visible:ring-primary shadow-sm"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] sm:justify-end gap-3">
          <Button
            variant="outline"
            disabled={isSaving}
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || isSaving}
            onClick={() => onSave(formData)}
            className="h-10 rounded-xl px-4 text-sm font-semibold"
          >
            {isSaving ? "Saving..." : (question?.id ? "Update Question" : "Add Question")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
