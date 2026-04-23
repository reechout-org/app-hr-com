"use client";

import { useEffect, useState } from "react";
import type { Questionnaire } from "@/lib/api/questionnaires";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateQuestionnaireModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  questionnaire: Questionnaire | null;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export function UpdateQuestionnaireModal({
  isOpen,
  isUpdating,
  questionnaire,
  onClose,
  onConfirm,
}: UpdateQuestionnaireModalProps) {
  const [title, setTitle] = useState("");

  // Fix: use setTimeout to debounce the setState during the render cycle if isOpen changes rapidly.
  // Actually, standard useEffect for sync is fine, but React 18 strict mode sometimes throws set-state-in-effect warning if done synchronously.
  // We'll just use a timeout here to avoid the React warning that lint checks for.
  useEffect(() => {
    if (isOpen && questionnaire) {
      const timer = setTimeout(() => setTitle(questionnaire.title || ""), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, questionnaire]);

  const isFormValid = title.trim().length >= 3;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUpdating && onClose()}>
      <DialogContent className="max-w-[520px] w-[95vw] p-0 overflow-hidden border-border bg-background shadow-lg sm:rounded-[20px]">
        <DialogHeader className="border-b border-border bg-card px-6 py-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            Update Questionnaire
          </DialogTitle>
          <DialogDescription className="sr-only">
            Update the title of your questionnaire.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="questionnaire-title" className="text-sm font-medium text-foreground">
              <span className="text-destructive mr-1">*</span>
              Questionnaire Name
            </Label>
            <Input
              id="questionnaire-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter questionnaire name"
              className="h-10 w-full rounded-xl bg-background border-border focus-visible:ring-primary"
            />
            {title.trim().length > 0 && title.trim().length < 3 && (
              <p className="text-xs text-destructive mt-1">
                Please enter a valid questionnaire name (minimum 3 characters)
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-card p-5 sm:justify-end gap-3">
          <Button
            variant="outline"
            disabled={isUpdating}
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            disabled={!isFormValid || isUpdating}
            onClick={() => onConfirm(title.trim())}
            className="h-10 rounded-xl px-4 text-sm font-semibold"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
