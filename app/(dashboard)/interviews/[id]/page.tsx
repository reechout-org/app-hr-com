"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

import { parseApiError } from "@/lib/api/client";
import { interviewsApi, type InterviewCandidate } from "@/lib/api/interviews";
import { Button } from "@/components/ui/button";

import { InterviewDetailHeader } from "./components/interview-header";
import { CandidatesTable } from "./components/candidates-table";
import { AddCandidateModal } from "./components/add-candidate-modal";
import { ShareInviteModal } from "./components/share-invite-modal";
import { InviteByLinkModal } from "./components/invite-by-link-modal";
import { AiReportModal } from "./components/ai-report-modal";
import { ScreeningReportModal } from "./components/screening-report-modal";
import { TranscriptModal } from "./components/transcript-modal";

interface InterviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewDetailPage({ params }: InterviewDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApplicationLinkModalOpen, setIsApplicationLinkModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedCandidateIdsForShare, setSelectedCandidateIdsForShare] = useState<string[]>([]);
  
  const [isAiReportOpen, setIsAiReportOpen] = useState(false);
  const [isScreeningReportOpen, setIsScreeningReportOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<InterviewCandidate | null>(null);

  const { data: interview, isLoading, isError } = useQuery({
    queryKey: ["interviews", id],
    queryFn: () => interviewsApi.getInterviewById(id),
  });

  const handleDownloadResume = async (candidate: InterviewCandidate) => {
    if (!candidate.id || !candidate.has_resume_file) {
      toast.error("No resume file available for download.");
      return;
    }

    const toastId = toast.loading("Preparing download…");
    try {
      const { download_url: downloadUrl } = await interviewsApi.downloadCandidateResume(
        candidate.id
      );
      if (!downloadUrl) {
        toast.error("No download link returned from the server.", { id: toastId });
        return;
      }

      const safeFirst = candidate.first_name.replace(/[^\w\-]/g, "_");
      const safeLast = candidate.last_name.replace(/[^\w\-]/g, "_");
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${safeFirst}_${safeLast}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Resume download started", { id: toastId });
    } catch (err) {
      toast.error(parseApiError(err), { id: toastId });
    }
  };

  /** Match Angular: only completed candidates can receive onsite (scheduling) invites. */
  const handleSendInvites = (candidateIds: string[]) => {
    const list = interview?.candidates || [];
    const completedIds = list
      .filter(
        (c) =>
          c.id &&
          candidateIds.includes(c.id) &&
          (c.status || "").toLowerCase() === "completed"
      )
      .map((c) => c.id!);

    if (completedIds.length === 0) {
      toast.warning("No completed candidates selected");
      return;
    }

    setSelectedCandidateIdsForShare(completedIds);
    setIsShareModalOpen(true);
  };

  const handleInviteByLink = () => {
    setIsApplicationLinkModalOpen(true);
  };

  if (isLoading) {
    return null;
  }

  if (isError || !interview) {
    return (
      <div className="mx-auto w-full max-w-[1400px] pt-4 pb-8 sm:pt-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-bold text-foreground">Interview Not Found</h2>
          <p className="mt-2 text-muted-foreground">The interview you are looking for does not exist or you don&apos;t have access.</p>
          <Button onClick={() => router.push("/interviews")} className="mt-6 rounded-xl">
            Back to Interviews
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[1400px] p-[clamp(1rem,3vw,2rem)] flex flex-col gap-6 lg:gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Button variant="outline" onClick={() => router.push("/interviews")} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-background text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-colors h-8 px-3">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Interviews</span>
          </Button>
        </div>

        <InterviewDetailHeader
          interview={interview}
          onShareLink={handleInviteByLink}
        />

        <InviteByLinkModal
          isOpen={isApplicationLinkModalOpen}
          onClose={() => setIsApplicationLinkModalOpen(false)}
          interviewId={interview.id}
        />

        <div className="mt-2">
          <CandidatesTable
            candidates={interview.candidates || []}
            onAddCandidate={() => setIsAddModalOpen(true)}
            onViewScreening={(candidate) => {
              setSelectedCandidate(candidate);
              setIsScreeningReportOpen(true);
            }}
            onViewAiReport={(candidate) => {
              setSelectedCandidate(candidate);
              setIsAiReportOpen(true);
            }}
            onViewTranscript={(candidate) => {
              setSelectedCandidate(candidate);
              setIsTranscriptOpen(true);
            }}
            onDownloadResume={handleDownloadResume}
            onSendInvites={handleSendInvites}
          />
        </div>

        {/* Modals */}
        <AddCandidateModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          interviewId={interview.id}
        />

        <ShareInviteModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedCandidateIdsForShare([]);
          }}
          interviewId={interview.id}
          selectedCandidateIds={selectedCandidateIdsForShare}
          defaultEmailSubject={interview.onsite_interview_email_subject ?? ""}
          defaultEmailTemplate={interview.onsite_interview_email_template ?? ""}
        />

        <AiReportModal
          isOpen={isAiReportOpen}
          onClose={() => {
            setIsAiReportOpen(false);
            setTimeout(() => setSelectedCandidate(null), 200); // clear after animation
          }}
          candidate={selectedCandidate}
        />

        <ScreeningReportModal
          isOpen={isScreeningReportOpen}
          onClose={() => {
            setIsScreeningReportOpen(false);
            setTimeout(() => setSelectedCandidate(null), 200);
          }}
          candidate={selectedCandidate}
        />
        
        <TranscriptModal
          isOpen={isTranscriptOpen}
          onClose={() => {
            setIsTranscriptOpen(false);
            setTimeout(() => setSelectedCandidate(null), 200);
          }}
          candidate={selectedCandidate}
        />
      </div>
    </div>
  );
}
