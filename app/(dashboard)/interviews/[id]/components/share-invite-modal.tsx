"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Mail, RotateCcw } from "lucide-react";

import { interviewsApi } from "@/lib/api/interviews";
import { cn } from "@/lib/ui/cn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function isValidHttpUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function PlaceholderChip({ children }: { children: ReactNode }) {
  return (
    <code
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-tight",
        "border-[rgba(var(--primary-color-rgb),0.3)] bg-[rgba(var(--primary-color-rgb),0.12)] text-[var(--primary-color)]",
        "dark:border-[rgba(var(--primary-color-rgb),0.4)] dark:bg-[rgba(var(--primary-color-rgb),0.18)] dark:text-[var(--text-primary)]"
      )}
    >
      {children}
    </code>
  );
}

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
  selectedCandidateIds: string[];
  /** From interview detail API — Django adds these on GET. */
  defaultEmailSubject: string;
  defaultEmailTemplate: string;
}

/**
 * Onsite interview invites: scheduling link (e.g. Calendly) + email subject/template.
 * Matches Angular `interview-detail` invite modal (not the header "Invite by Link" copy action).
 */
export function ShareInviteModal({
  isOpen,
  onClose,
  interviewId,
  selectedCandidateIds,
  defaultEmailSubject,
  defaultEmailTemplate,
}: ShareInviteModalProps) {
  const queryClient = useQueryClient();

  const [schedulingInviteLink, setSchedulingInviteLink] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSchedulingInviteLink("");
    setEmailSubject(defaultEmailSubject);
    setEmailTemplate(defaultEmailTemplate);
  }, [isOpen, defaultEmailSubject, defaultEmailTemplate]);

  const resetToDefaults = () => {
    setEmailSubject(defaultEmailSubject);
    setEmailTemplate(defaultEmailTemplate);
  };

  const sendMutation = useMutation({
    mutationFn: () =>
      interviewsApi.sendInvitesToCandidates(
        interviewId,
        selectedCandidateIds,
        schedulingInviteLink.trim(),
        emailTemplate,
        emailSubject
      ),
    onSuccess: (data) => {
      const sentCount =
        typeof data === "object" &&
        data !== null &&
        "sent_count" in data &&
        typeof (data as { sent_count?: number }).sent_count === "number"
          ? (data as { sent_count: number }).sent_count
          : selectedCandidateIds.length;
      toast.success("Invites sent", {
        description: `Invites sent successfully to ${sentCount} candidate(s).`,
      });
      queryClient.invalidateQueries({ queryKey: ["interviews", interviewId] });
      onClose();
    },
    onError: (err) => {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      toast.error(msg || "Failed to send invites. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = schedulingInviteLink.trim();
    if (!link) {
      toast.error("Please enter a scheduling invite link (e.g. Calendly).");
      return;
    }
    if (!isValidHttpUrl(link)) {
      toast.error("Please enter a valid URL (e.g. https://calendly.com/your-link).");
      return;
    }
    if (!emailSubject.trim()) {
      toast.error("Please enter an email subject.");
      return;
    }
    if (!emailTemplate.trim()) {
      toast.error("Please enter an email template.");
      return;
    }
    sendMutation.mutate();
  };

  const n = selectedCandidateIds.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="flex max-h-[85vh] w-[min(100vw-2rem,900px)] flex-col gap-0 overflow-hidden p-0 border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]"
      >
        <div className="shrink-0 border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09]">
          <DialogHeader className="space-y-0 p-0 text-left">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Send Onsite Interview Invites
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Customize the email template and send invites to {n} selected
              candidate{n !== 1 ? "s" : ""}
            </p>
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-2 text-primary"
                onClick={resetToDefaults}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to default
              </Button>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="scheduling-link" className="text-sm font-medium">
                  Invite link (Calendly or other scheduling link){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="scheduling-link"
                  type="url"
                  value={schedulingInviteLink}
                  onChange={(e) => setSchedulingInviteLink(e.target.value)}
                  placeholder="https://calendly.com/your-link"
                  className="h-10 rounded-xl bg-background"
                />
                <p className="text-xs text-[var(--text-secondary)]">
                  This URL is sent to candidates as <PlaceholderChip>{"{invite_link}"}</PlaceholderChip> in
                  the email template.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="onsite-subject" className="text-sm font-medium">
                  Email subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="onsite-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="h-10 rounded-xl bg-background"
                  placeholder="Interview invitation — {interview_title} @ {company_name}"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="onsite-template" className="text-sm font-medium">
                  Email template <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="onsite-template"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  className="min-h-[300px] resize-y rounded-xl bg-background"
                  placeholder="Use placeholders: {candidate_name}, {interview_title}, {company_name}, {invite_link}"
                />
                <div className="text-xs text-[var(--text-secondary)]">
                  <p className="mb-2 font-medium text-[var(--text-primary)]">Available placeholders</p>
                  <div className="flex flex-wrap gap-2">
                    {["{candidate_name}", "{interview_title}", "{company_name}", "{invite_link}"].map(
                      (p) => (
                        <PlaceholderChip key={p}>{p}</PlaceholderChip>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[var(--border-color-light)] bg-[var(--background-color)] px-6 py-4 dark:border-white/[0.09]">
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl px-6"
                onClick={onClose}
                disabled={sendMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 gap-2 rounded-xl bg-[var(--primary-color)] px-6 font-semibold text-white hover:bg-[var(--primary-color-hover)]"
                disabled={sendMutation.isPending}
              >
                <Mail className="h-4 w-4" />
                {sendMutation.isPending ? "Sending…" : "Send invites"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
