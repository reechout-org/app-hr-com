"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { validateFirstMessageTemplateClient } from "@/lib/utils/first-message-template";
import { toast } from "sonner";

interface IntroMessageModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  initialMessage: string;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

export function IntroMessageModal({ isOpen, isUpdating, initialMessage, onClose, onConfirm }: IntroMessageModalProps) {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    const err = validateFirstMessageTemplateClient(message);
    if (err) {
      toast.error(err);
      return;
    }
    onConfirm(message);
  };

  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid set-state-in-effect warning
      const timer = setTimeout(() => setMessage(initialMessage), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMessage]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUpdating && onClose()}>
      <DialogContent className="max-w-[600px] w-[95vw] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
        <DialogHeader className="border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] px-6 py-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            Edit Intro Message Template
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edit the message your candidate hears first.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Template Message
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter template message..."
              rows={4}
              className="w-full rounded-xl bg-[var(--surface-2)] border-[var(--border-color-light)] hover:border-[rgba(var(--primary-color-rgb),0.28)] dark:border-white/[0.09] focus-visible:ring-primary shadow-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Variables are optional. If used, only these are allowed: {'{{'} candidate_name {'}}'}, {'{{'} company_name {'}}'}, {'{{'} interview_title {'}}'}
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--border-color-light)] bg-[var(--surface-2)] sm:justify-end gap-3 dark:border-white/[0.09]">
          <Button
            variant="outline"
            disabled={isUpdating}
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            disabled={!message.trim() || isUpdating}
            onClick={handleConfirm}
            className="h-10 rounded-xl px-4 text-sm font-semibold"
          >
            {isUpdating ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
