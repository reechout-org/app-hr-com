"use client";

import { AlertCircle, HelpCircle, Info } from "lucide-react";
import type { Question } from "@/lib/api/questionnaires";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteQuestionModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  question: Question | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteQuestionModal({
  isOpen,
  isDeleting,
  question,
  onClose,
  onConfirm,
}: DeleteQuestionModalProps) {
  if (!question) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialogContent className="max-w-[520px] w-[95vw] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
        
        <div className="flex items-center gap-4 border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
            <AlertCircle className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-[22px] font-semibold text-foreground">
              Delete Question
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        <div className="flex flex-col gap-6 bg-transparent p-6">
          <AlertDialogDescription className="text-[15px] leading-relaxed text-muted-foreground">
            Are you sure you want to delete this question? This action cannot be undone.
          </AlertDialogDescription>

          <div className="overflow-hidden rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] px-5 py-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-[15px] font-semibold text-foreground">
                Question Details
              </span>
            </div>
            <div className="flex flex-col p-5">
              <div className="flex items-center justify-between border-b border-[var(--border-color-light)] dark:border-white/[0.09] py-3 first:pt-0 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-muted-foreground shrink-0 w-20">Text:</span>
                <span className="flex-1 line-clamp-3 break-words text-right text-sm font-semibold text-foreground ml-4">
                  {question.question_text}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border-color-light)] dark:border-white/[0.09] py-3 first:pt-0 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-muted-foreground">Order:</span>
                <span className="max-w-[200px] break-words text-right text-sm font-semibold text-foreground">
                  {question.order}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
            <Info className="h-5 w-5 shrink-0 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              This question will be permanently removed from the questionnaire.
            </span>
          </div>
        </div>

        <AlertDialogFooter className="border-t border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] p-5 sm:justify-end gap-3">
          <AlertDialogCancel disabled={isDeleting} asChild>
            <Button variant="outline" className="h-10 rounded-xl px-4 text-sm font-medium">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={(e) => { e.preventDefault(); onConfirm(); }} asChild>
            <Button variant="destructive" className="h-10 rounded-xl px-4 text-sm font-semibold">
              {isDeleting ? "Deleting..." : "Delete Question"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
