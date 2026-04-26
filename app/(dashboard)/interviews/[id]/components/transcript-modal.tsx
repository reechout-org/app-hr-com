"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, User as UserIcon } from "lucide-react";

import { interviewsApi, type InterviewCandidate } from "@/lib/api/interviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/ui/cn";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: InterviewCandidate | null;
}

export function TranscriptModal({
  isOpen,
  onClose,
  candidate,
}: TranscriptModalProps) {
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["candidate-report", candidate?.id],
    queryFn: () => interviewsApi.getCandidateReport(candidate!.id!),
    enabled: isOpen && !!candidate?.id,
  });

  const parseTranscript = (transcript: string | null | undefined) => {
    if (!transcript) return [];
    const messages: Array<{ speaker: string; message: string }> = [];
    const lines = transcript.split('\n');

    for (const line of lines) {
      if (line.trim()) {
        if (line.startsWith('User:')) {
          messages.push({
            speaker: 'user',
            message: line.replace('User:', '').trim(),
          });
        } else if (line.startsWith('AI:')) {
          messages.push({
            speaker: 'ai',
            message: line.replace('AI:', '').trim(),
          });
        }
      }
    }
    return messages;
  };

  const messages = parseTranscript(report?.transcript);

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[85vh] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09] shrink-0">
          <DialogHeader className="p-0 text-left flex flex-row items-center gap-4 w-full">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(var(--primary-color-rgb),0.15)] to-[rgba(var(--primary-color-rgb),0.08)] border border-[rgba(var(--primary-color-rgb),0.2)] shadow-[0_2px_8px_rgba(var(--primary-color-rgb),0.1)] transition-all duration-300">
              <UserIcon className="h-6 w-6 text-[var(--icon-accent-color)]" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <DialogTitle className="text-xl font-bold text-foreground leading-none">
                {candidate.first_name} {candidate.last_name}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <MailIcon className="h-3.5 w-3.5" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1.5 text-[var(--primary-color)]">
                  <FileText className="h-3.5 w-3.5" />
                  Interview Transcript
                </span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--surface-1)]">
          {isLoading ? (
            <div className="min-h-[200px] flex-1" aria-hidden />
          ) : isError || !report ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <FileText className="h-10 w-10 opacity-50" />
              <p>Unable to load the transcript.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <FileText className="h-10 w-10 opacity-50" />
              <p>No transcript available for this interview.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full px-2 sm:px-6">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex w-full",
                    msg.speaker === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div 
                    className={cn(
                      "flex flex-col max-w-[85%] sm:max-w-[75%] rounded-[16px] p-[16px_20px] shadow-sm",
                      msg.speaker === 'user' 
                        ? 'bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-color-hover)] text-white rounded-br-[4px]' 
                        : 'bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/[0.09] text-foreground rounded-bl-[4px]'
                    )}
                  >
                    <div className="text-[14px] sm:text-[15px] leading-[1.6] whitespace-pre-wrap">{msg.message}</div>
                    <div 
                      className={cn(
                        "text-[11px] mt-2 font-bold uppercase tracking-wider", 
                        msg.speaker === 'user' ? 'text-white/70 text-right' : 'text-muted-foreground text-left'
                      )}
                    >
                      {msg.speaker === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09]">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Inline helper because we just need the icon here without importing it at the top globally
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
