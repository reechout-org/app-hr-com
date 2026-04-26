"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InviteByLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
}

/**
 * Public screening / application link candidates use to start the flow.
 * Complements Angular’s copy-only `shareInterview` by showing the URL in a dialog with copy.
 */
export function InviteByLinkModal({
  isOpen,
  onClose,
  interviewId,
}: InviteByLinkModalProps) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const applicationUrl = origin
    ? `${origin}/interview/screening/${interviewId}`
    : "";

  const handleCopy = () => {
    if (!applicationUrl) return;
    void navigator.clipboard.writeText(applicationUrl).then(
      () => {
        toast.success(
          "Application link copied to clipboard! Ready to share with candidates.",
          { duration: 3000 }
        );
      },
      () => {
        toast.error("Failed to copy link. Please try again.");
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg gap-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] p-0 shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
        <div className="border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09]">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-lg font-bold text-foreground">
              Application link
            </DialogTitle>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Share this URL with candidates so they can open the application and screening interview.
            </p>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="application-link-url" className="text-sm font-medium">
              Link
            </Label>
            <div className="flex gap-2">
              <Input
                id="application-link-url"
                readOnly
                value={applicationUrl}
                className="min-w-0 flex-1 rounded-xl border-[var(--header-floating-border)] bg-background font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 rounded-xl border-[var(--header-floating-border)] px-4"
                onClick={handleCopy}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              className="h-10 rounded-xl bg-[var(--primary-color)] px-6 font-semibold text-white hover:bg-[var(--primary-color-hover)]"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
