"use client";

import { AlertCircle, FileText, Info } from "lucide-react";
import { format } from "date-fns";
import type { Questionnaire } from "@/lib/api/questionnaires";
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

interface DeleteQuestionnaireModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  questionnaire: Questionnaire | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteQuestionnaireModal({
  isOpen,
  isDeleting,
  questionnaire,
  onClose,
  onConfirm,
}: DeleteQuestionnaireModalProps) {
  if (!questionnaire) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialogContent className="max-w-[520px] w-[95vw] p-0 overflow-hidden border-border bg-background shadow-lg sm:rounded-[20px]">
        
        <div className="flex items-center gap-4 border-b border-border bg-card p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
            <AlertCircle className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-[22px] font-semibold text-foreground">
              Delete Questionnaire
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        <div className="flex flex-col gap-6 bg-background p-6">
          <AlertDialogDescription className="text-[15px] leading-relaxed text-muted-foreground">
            Are you sure you want to delete this questionnaire? This action cannot be undone.
          </AlertDialogDescription>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border bg-card px-5 py-4">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-[15px] font-semibold text-foreground">
                Questionnaire Details
              </span>
            </div>
            <div className="flex flex-col p-5">
              <div className="flex items-center justify-between border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-muted-foreground">Title:</span>
                <span className="max-w-[200px] break-words text-right text-sm font-semibold text-foreground">
                  {questionnaire.title}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-muted-foreground">Questions:</span>
                <span className="max-w-[200px] break-words text-right text-sm font-semibold text-foreground">
                  {questionnaire.number_of_questions}
                </span>
              </div>
              {questionnaire.created_at && (
                <div className="flex items-center justify-between border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-muted-foreground">Created:</span>
                  <span className="max-w-[200px] break-words text-right text-sm font-semibold text-foreground">
                    {format(new Date(questionnaire.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
            <Info className="h-5 w-5 shrink-0 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              All associated data will be permanently removed.
            </span>
          </div>
        </div>

        <AlertDialogFooter className="border-t border-border bg-card p-5 sm:justify-end gap-3">
          <AlertDialogCancel disabled={isDeleting} asChild>
            <Button variant="outline" className="h-10 rounded-xl px-4 text-sm font-medium">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={(e) => { e.preventDefault(); onConfirm(); }} asChild>
            <Button variant="destructive" className="h-10 rounded-xl px-4 text-sm font-semibold">
              {isDeleting ? "Deleting..." : "Delete Questionnaire"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
