"use client";

import { useMemo, useState, type ComponentType, type SVGProps } from "react";
import { format } from "date-fns";
import {
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSearch,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  User as UserIcon,
  Users,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/ui/cn";
import { formatStatusLabel } from "@/lib/ui/format-status-label";
import type { InterviewCandidate } from "@/lib/api/interviews";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type TableActionIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface CandidatesTableProps {
  candidates: InterviewCandidate[];
  onAddCandidate: () => void;
  onViewScreening: (candidate: InterviewCandidate) => void;
  onViewAiReport: (candidate: InterviewCandidate) => void;
  onViewTranscript: (candidate: InterviewCandidate) => void;
  onDownloadResume: (candidate: InterviewCandidate) => void;
  onSendInvites: (candidateIds: string[]) => void;
}

const copyToClipboard = (text: string, type: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${type} copied to clipboard`);
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "screening_passed":
      return "text-[var(--success-color)] bg-[rgba(var(--success-color-rgb),0.1)] border-[rgba(var(--success-color-rgb),0.2)]";
    case "invited":
    case "accepted":
    case "rescheduled":
    case "in_progress":
      return "text-[var(--brand-blue-modern)] bg-[rgba(var(--brand-blue-modern-rgb),0.1)] border-[rgba(var(--brand-blue-modern-rgb),0.2)]";
    case "declined":
    case "no_show":
    case "screening_rejected":
      return "text-[var(--error-color)] bg-[rgba(var(--error-color-rgb),0.1)] border-[rgba(var(--error-color-rgb),0.2)]";
    default:
      return "text-[var(--warning-color)] bg-[rgba(var(--warning-color-rgb),0.1)] border-[rgba(var(--warning-color-rgb),0.2)]";
  }
};

const getScoreColor = (score: number | null | undefined) => {
  if (score === null || score === undefined) return "text-[var(--text-secondary)]";
  if (score >= 70) return "text-[var(--success-color)]";
  if (score >= 40) return "text-[var(--warning-color)]";
  return "text-[var(--error-color)]";
};

const Separator = () => (
  <>
    <div className="hidden sm:block w-px h-[50px] bg-gradient-to-b from-transparent via-[var(--header-floating-border)] to-transparent shrink-0" />
    <div className="h-px w-full bg-[var(--header-floating-border)] sm:hidden shrink-0" />
  </>
);

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex-1 p-[16px] sm:p-[18px_16px] flex items-center justify-start min-w-0 bg-transparent", className)}>
    {children}
  </div>
);

const ActionTrigger = ({ icon: Icon, title, subtitle, onClick, disabled }: { icon: TableActionIcon; title: string; subtitle: string; onClick?: () => void; disabled?: boolean }) => (
  <div 
    className={cn(
      "flex items-center gap-[8px] p-[10px_14px] border border-[var(--header-floating-border)] bg-background rounded-xl w-full sm:w-auto min-w-[120px] transition-all duration-200 group/btn",
      disabled ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-[var(--surface-2)] hover:border-[rgba(var(--primary-color-rgb),0.3)] hover:shadow-sm active:scale-[0.98]"
    )}
    onClick={!disabled ? onClick : undefined}
  >
    <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] transition-all duration-200 group-hover/btn:bg-[rgba(var(--primary-color-rgb),0.1)]">
      <Icon className={cn("h-4 w-4 text-[var(--text-secondary)] transition-colors duration-200", !disabled && "group-hover/btn:text-[var(--primary-color)]")} />
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className={cn("text-[13px] font-semibold text-[var(--text-primary)] mb-[2px] transition-colors duration-200 truncate", !disabled && "group-hover/btn:text-[var(--primary-color)]")}>{title}</span>
      <span className={cn("text-[11px] text-[var(--text-secondary)] transition-colors duration-200 truncate", !disabled && "group-hover/btn:text-[var(--text-primary)]")}>{subtitle}</span>
    </div>
  </div>
);

const getCandidatePriority = (status?: string): number => {
  const s = status?.toLowerCase() || '';
  if (s === "completed") return 1;
  if (s === "accepted" || s === "rescheduled") return 2;
  if (s === "screening_passed") return 3;
  if (s === "screening_rejected") return 4;
  return 5;
};

const getCandidateScoreForSorting = (candidate: InterviewCandidate): number | null => {
  const isCompleted = candidate.status === "completed";
  const report = candidate.reports && candidate.reports.length > 0 ? candidate.reports[0] : null;
  
  let scoreValue: number | null | undefined = null;
  if (isCompleted && report) {
    scoreValue = report.score ? parseFloat(report.score) : null;
  } else if (!isCompleted && report?.screening_score) {
    scoreValue = parseFloat(report.screening_score);
  } else if (candidate.score !== null && candidate.score !== undefined) {
    scoreValue = typeof candidate.score === "string" ? parseFloat(candidate.score) : candidate.score;
  }
  
  return scoreValue !== null && scoreValue !== undefined && !isNaN(scoreValue as number) ? (scoreValue as number) : null;
};

export function CandidatesTable({
  candidates,
  onAddCandidate,
  onViewScreening,
  onViewAiReport,
  onViewTranscript,
  onDownloadResume,
  onSendInvites,
}: CandidatesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredCandidates = useMemo(() => {
    let result = candidates || [];
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(lowerQ) ||
          c.last_name.toLowerCase().includes(lowerQ) ||
          c.email.toLowerCase().includes(lowerQ)
      );
    }
    if (statusFilter) {
      result = result.filter((c) => (c.status || "pending").toLowerCase() === statusFilter.toLowerCase());
    }

    return [...result].sort((a, b) => {
      const priorityA = getCandidatePriority(a.status);
      const priorityB = getCandidatePriority(b.status);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const scoreA = getCandidateScoreForSorting(a);
      const scoreB = getCandidateScoreForSorting(b);

      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;

      return scoreB - scoreA;
    });
  }, [candidates, searchQuery, statusFilter]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredCandidates.slice(startIndex, startIndex + pageSize);
  }, [filteredCandidates, page, pageSize]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSendInvites = () => {
    onSendInvites(Array.from(selectedIds));
    setIsSelecting(false);
    setSelectedIds(new Set());
  };

  const renderDate = (candidate: InterviewCandidate) => {
    const status = candidate.status?.toLowerCase() || '';
    if (status === 'invited' && candidate.invited_at) {
      return format(new Date(candidate.invited_at), "MMM d, h:mm a");
    }
    if (['accepted', 'rescheduled'].includes(status) && candidate.schedule_date) {
      return format(new Date(candidate.schedule_date), "MMM d, h:mm a");
    }
    if (['screening_passed', 'screening_rejected', 'no_show', 'declined', 'completed'].includes(status) && candidate.updated_at) {
      return format(new Date(candidate.updated_at), "MMM d, h:mm a");
    }
    return null;
  };

  return (
    <div className="flex flex-col">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 bg-[var(--header-floating-bg)] border border-[var(--header-floating-border)] rounded-[var(--radius-md)] mb-4 shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] transition-all hover:shadow-[0_20px_40px_rgba(var(--shadow-rgb),0.08)] hover:border-[rgba(var(--primary-color-rgb),0.28)]">
        <div className="flex items-center gap-3">
          <Select value={statusFilter || "all"} onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}>
            <SelectTrigger className="h-10 min-w-[160px] rounded-xl bg-background shadow-sm border-[var(--header-floating-border)] focus:ring-[var(--primary-color)]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
              <SelectItem value="screening_passed">Screening Passed</SelectItem>
              <SelectItem value="screening_rejected">Screening Rejected</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter) && (
            <Button variant="ghost" className="h-10 rounded-xl" onClick={() => { setSearchQuery(""); setStatusFilter(""); }}>
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl pl-9 bg-[var(--surface-2)] border-[var(--border-color-light)] focus-visible:ring-[var(--primary-color)] shadow-sm"
            />
          </div>

          <Button 
            variant={isSelecting ? "default" : "outline"} 
            className={cn("h-10 rounded-xl", isSelecting && "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color-hover)]")}
            onClick={() => { setIsSelecting(!isSelecting); setSelectedIds(new Set()); }}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isSelecting ? "Cancel Selection" : "Select"}
          </Button>

          <Button 
            className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onAddCandidate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {isSelecting && selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--primary-color)]/30 bg-[var(--primary-color)]/10 p-4 mb-4 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-[var(--primary-color)]">
            {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <Button onClick={handleSendInvites} className="rounded-xl bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white">
            <Mail className="mr-2 h-4 w-4" />
            Send Invite to Selected Candidate(s)
          </Button>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-4">
        {paginatedCandidates.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 bg-[var(--header-floating-bg)] rounded-[var(--radius-md)] border border-[var(--header-floating-border)] shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)]">
            <Users className="h-8 w-8 opacity-50" />
            <p>No candidates found matching your filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginatedCandidates.map((candidate) => {
              const isCompleted = candidate.status === "completed";
              const report = candidate.reports && candidate.reports.length > 0 ? candidate.reports[0] : null;
              const hasScreening = !!report?.screening_evaluation && ['screening_passed', 'screening_rejected'].includes(candidate.status || '');
              const scoreLabel = isCompleted ? "Score" : "Screening Score";
              
              let scoreValue: number | null | undefined = null;
              if (isCompleted && report) {
                scoreValue = report.score ? parseFloat(report.score) : null;
              } else if (!isCompleted && report?.screening_score) {
                scoreValue = parseFloat(report.screening_score);
              } else if (candidate.score !== null && candidate.score !== undefined) {
                scoreValue = typeof candidate.score === 'string' ? parseFloat(candidate.score) : candidate.score;
              }

              const dateStr = renderDate(candidate);

              return (
                <div 
                  key={candidate.id} 
                  className={cn(
                    "group flex flex-col sm:flex-row sm:items-center rounded-[var(--radius-md)] border-[1.5px] border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] transition-all duration-300 hover:border-[rgba(var(--primary-color-rgb),0.4)] hover:shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.12)] hover:-translate-y-[2px] overflow-hidden relative min-h-[80px]",
                    isSelecting && candidate.id && selectedIds.has(candidate.id) && "border-[rgba(var(--primary-color-rgb),0.6)] bg-[rgba(var(--primary-color-rgb),0.03)] shadow-[0_4px_16px_rgba(var(--primary-color-rgb),0.2)]"
                  )}
                >
                  {/* Accent border top on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(var(--primary-color-rgb),0.3)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

                  {isSelecting && (
                    <div className="flex items-center justify-center p-[16px] sm:p-[18px_16px] shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={candidate.id ? selectedIds.has(candidate.id) : false}
                        onCheckedChange={() => candidate.id && toggleSelection(candidate.id)}
                        className="h-5 w-5 rounded-[4px] data-[state=checked]:bg-[var(--primary-color)] data-[state=checked]:border-[var(--primary-color)]"
                      />
                    </div>
                  )}

                  {/* Section 1: Info */}
                  <Section className={cn("flex-[1.5] flex-col items-start justify-center", isSelecting && "sm:pl-0")}>
                    <div className="flex items-center gap-[10px] min-w-0 w-full">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(var(--primary-color-rgb),0.15)] to-[rgba(var(--primary-color-rgb),0.08)] border border-[rgba(var(--primary-color-rgb),0.2)] shadow-[0_2px_8px_rgba(var(--primary-color-rgb),0.1)] transition-all duration-300">
                        <UserIcon className="h-[18px] w-[18px] text-[var(--icon-accent-color)]" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-[4px] tracking-[-0.2px] truncate w-full">
                          {candidate.first_name} {candidate.last_name}
                        </h4>
                        <div className="flex flex-col gap-[3px] min-w-0 w-full">
                          <button 
                            onClick={() => copyToClipboard(candidate.email, "Email")}
                            className="flex items-center gap-[5px] text-[12px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] text-left -mx-1 px-1 py-[1px] rounded hover:bg-[rgba(var(--primary-color-rgb),0.08)] w-full overflow-hidden group/btn"
                            title="Click to copy email"
                          >
                            <Mail className="h-3 w-3 shrink-0 text-[var(--icon-accent-color)] transition-transform duration-200 group-hover/btn:scale-110" />
                            <span className="truncate">{candidate.email}</span>
                          </button>
                          {candidate.phone && (
                            <button 
                              onClick={() => copyToClipboard(candidate.phone, "Phone")}
                              className="flex items-center gap-[5px] text-[12px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] text-left -mx-1 px-1 py-[1px] rounded hover:bg-[rgba(var(--primary-color-rgb),0.08)] w-full overflow-hidden max-md:hidden group/btn"
                              title="Click to copy phone"
                            >
                              <Phone className="h-3 w-3 shrink-0 text-[var(--icon-accent-color)] transition-transform duration-200 group-hover/btn:scale-110" />
                              <span className="truncate">{candidate.phone}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Section>

                  <Separator />

                  {/* Section 2: Score */}
                  <Section className="flex-col items-start sm:items-center justify-center">
                    <div className="flex flex-col items-start gap-[2px] p-[8px_14px] bg-background/50 backdrop-blur-[10px] rounded-[10px] border border-[var(--header-floating-border)] w-full max-w-[160px]">
                      <span className="text-[11px] uppercase tracking-[0.5px] text-[var(--text-secondary)] opacity-80">
                        {scoreLabel}
                      </span>
                      <span className={cn("text-[16px] font-bold leading-[1.2]", getScoreColor(scoreValue))}>
                        {scoreValue !== null && scoreValue !== undefined && !isNaN(scoreValue as number) ? `${scoreValue}%` : "-"}
                      </span>
                    </div>
                  </Section>

                  <Separator />

                  {/* Dynamic Action Sections */}
                  {isCompleted ? (
                    <>
                      <Section className="justify-center">
                        <ActionTrigger 
                          icon={Bot} 
                          title="AI Report" 
                          subtitle="View assessment" 
                          onClick={() => onViewAiReport(candidate)} 
                        />
                      </Section>
                      <Separator />
                      <Section className="justify-center">
                        <ActionTrigger 
                          icon={FileText} 
                          title="Transcript" 
                          subtitle="View conversation" 
                          onClick={() => onViewTranscript(candidate)} 
                        />
                      </Section>
                    </>
                  ) : (
                    <Section className="justify-center">
                      {hasScreening ? (
                        <ActionTrigger 
                          icon={FileSearch} 
                          title="Screening" 
                          subtitle="View report" 
                          onClick={() => onViewScreening(candidate)} 
                        />
                      ) : (
                        <ActionTrigger 
                          icon={FileText} 
                          title="Pending" 
                          subtitle="No report yet" 
                          disabled 
                        />
                      )}
                    </Section>
                  )}

                  <Separator />

                  {/* Status & Date */}
                  <Section className="flex-col items-start sm:items-center justify-center gap-[10px]">
                    <span className={cn(
                      "inline-flex items-center gap-[4px] rounded-[8px] border px-[12px] py-[6px] text-xs font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-md w-fit capitalize", 
                      getStatusColor(candidate.status || 'pending')
                    )}>
                      {formatStatusLabel(candidate.status)}
                      {candidate.status === 'screening_passed' && <CheckCircle className="h-[14px] w-[14px]" />}
                      {candidate.status === 'screening_rejected' && <XCircle className="h-[14px] w-[14px]" />}
                    </span>
                    
                    {dateStr && (
                      <div className="flex items-center justify-start sm:justify-center gap-[6px] text-[12px] text-[var(--text-secondary)] px-[10px] py-[4px] bg-background/50 backdrop-blur-[8px] rounded-[6px] border border-[var(--header-floating-border)] w-full max-w-[180px]">
                        <Clock className="h-[12px] w-[12px] text-[var(--icon-accent-color)] shrink-0" />
                        <span className="truncate">{dateStr}</span>
                      </div>
                    )}
                  </Section>

                  <Separator />

                  {/* Dropdown Actions */}
                  <div className="flex-none p-[16px] sm:p-[8px_12px] min-w-[60px] flex items-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-color)] text-[var(--text-secondary)]">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-[0_8px_32px_rgba(var(--shadow-rgb),0.12)] border-[var(--header-floating-border)] bg-[var(--header-floating-bg)]">
                        <DropdownMenuItem 
                          disabled={!candidate.has_resume_file}
                          onClick={() => onDownloadResume(candidate)}
                          className="py-2.5 font-medium hover:bg-[var(--surface-2)]"
                        >
                          <Download className="mr-2 h-4 w-4 text-[var(--text-muted)]" />
                          Download Resume
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCandidates.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            {filteredCandidates.length > 0 ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredCandidates.length)} of ${filteredCandidates.length} candidates` : ''}
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={pageSize.toString()} 
              onValueChange={(val) => { setPageSize(Number(val)); setPage(1); }}
            >
              <SelectTrigger className="h-9 w-[110px] rounded-xl border-[var(--header-floating-border)] bg-background text-[var(--text-primary)] shadow-sm">
                <SelectValue placeholder="10 / page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-[var(--header-floating-border)] bg-background text-[var(--text-primary)] hover:bg-[var(--surface-2)] shadow-sm"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-[var(--header-floating-border)] bg-background text-[var(--text-primary)] hover:bg-[var(--surface-2)] shadow-sm"
                disabled={page >= Math.ceil(filteredCandidates.length / pageSize)}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}