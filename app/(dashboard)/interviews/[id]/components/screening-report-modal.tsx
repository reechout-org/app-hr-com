"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState, type ComponentType, type SVGProps } from "react";
import { 
  CheckCircle, 
  FileText, 
  Star, 
  XCircle,
  HelpCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/ui/cn";

import { interviewsApi, type InterviewCandidate } from "@/lib/api/interviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ScreeningReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: InterviewCandidate | null;
}

type ReportNavIcon = ComponentType<SVGProps<SVGSVGElement>>;

type SectionKey = 'scores' | 'evaluation' | 'answers';

export function ScreeningReportModal({
  isOpen,
  onClose,
  candidate,
}: ScreeningReportModalProps) {
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["candidate-report", candidate?.id],
    queryFn: () => interviewsApi.getCandidateReport(candidate!.id!),
    enabled: isOpen && !!candidate?.id,
  });

  const [activeSection, setActiveSection] = useState<SectionKey>('scores');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const sections: SectionKey[] = ['scores', 'evaluation', 'answers'];
    
    let currentActive: SectionKey = 'scores';
    for (const section of sections) {
      const el = document.getElementById(`scr-${section}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 300) {
          currentActive = section;
        }
      }
    }
    setActiveSection(currentActive);
  };

  const scrollToSection = (id: SectionKey) => {
    const el = document.getElementById(`scr-${id}`);
    const container = scrollRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      
      const scrollTop = elRect.top - containerRect.top + container.scrollTop - 20;
      
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (!candidate) return null;

  const candidateInitials = `${candidate.first_name?.[0] || ''}${candidate.last_name?.[0] || ''}`.toUpperCase();

  const getScoreColor = (scoreStr: string | number | null | undefined): string => {
    if (!scoreStr) return "var(--text-secondary)";
    const score = typeof scoreStr === 'string' ? parseFloat(scoreStr) : scoreStr;
    if (score >= 70) return "var(--success-color)";
    if (score >= 40) return "var(--warning-color)";
    return "var(--error-color)";
  };

  const formatScore = (scoreStr: string | number | null | undefined) => {
    if (scoreStr === null || scoreStr === undefined) return { value: '-', unit: '' };
    const score = typeof scoreStr === 'string' ? parseFloat(scoreStr) : scoreStr;
    return { value: score, unit: '%' };
  };

  const hasAnswers = report?.screening_answers && Object.keys(report.screening_answers).length > 0;
  const isPassed = report?.screening_passed ?? candidate.status === 'screening_passed';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1200px] w-[95vw] h-[85vh] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09] flex flex-col">
        
        {/* Wrapper */}
        <div className="flex h-full w-full bg-[var(--background-color)] text-foreground">
          
          {/* Left Sidebar */}
          <div className="w-[300px] shrink-0 border-r border-[var(--border-color-light)] dark:border-white/10 bg-[var(--surface-1)] flex flex-col">
            {/* Profile Card */}
            <div className="relative flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[rgba(var(--primary-color-rgb),0.15)] to-[rgba(var(--primary-color-rgb),0.08)] backdrop-blur-md border border-[var(--glass-border-medium)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden m-0 text-[var(--text-primary)]">
              {/* Pseudo-element top border glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.6)] to-transparent" />
              
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-color-hover)] shadow-[0_4px_12px_rgba(var(--primary-color-rgb),0.3)] mb-4 text-xl font-bold text-white z-10">
                {candidateInitials}
              </div>
              <div className="flex flex-col min-w-0 z-10">
                <div className="text-[18px] font-bold truncate text-[var(--text-primary)] tracking-tight mb-1">
                  {candidate.first_name} {candidate.last_name}
                </div>
                <div className="text-[13px] text-[var(--text-secondary)] font-medium truncate opacity-90">
                  {candidate.email}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* General */}
              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 px-3">General</div>
                <NavItem 
                  icon={Star} 
                  label="Score" 
                  isActive={activeSection === 'scores'} 
                  onClick={() => scrollToSection('scores')} 
                />
                {report?.screening_evaluation && (
                  <NavItem 
                    icon={FileText} 
                    label="Evaluation" 
                    isActive={activeSection === 'evaluation'} 
                    onClick={() => scrollToSection('evaluation')} 
                  />
                )}
              </div>

              {/* Details */}
              {hasAnswers && (
                <div className="mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 px-3">Details</div>
                  <NavItem 
                    icon={HelpCircle} 
                    label="Answers" 
                    isActive={activeSection === 'answers'} 
                    onClick={() => scrollToSection('answers')} 
                  />
                </div>
              )}
            </div>
            
            {/* Close Button at bottom of sidebar */}
            <div className="p-4 border-t border-[var(--border-color-light)] dark:border-white/10">
              <Button variant="ghost" onClick={onClose} className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)] rounded-xl">
                <X className="h-4 w-4 mr-2" />
                Close Report
              </Button>
            </div>
          </div>

          {/* Right Content Panel */}
          <div 
            className="flex-1 overflow-y-auto p-8 lg:p-12 relative bg-[var(--surface-2)] custom-scrollbar" 
            onScroll={handleScroll}
            ref={scrollRef}
          >
            {/* Ambient Background Glow matching Angular */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--primary-color)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

            {isLoading ? (
              <div className="min-h-[50vh]" aria-hidden />
            ) : isError || !report ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <FileText className="h-12 w-12 opacity-50" />
                <p>Unable to load the report.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-12 max-w-[900px] mx-auto relative z-10 pb-20">
                
                {/* 1. Score Section */}
                <div id="scr-scores" className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Score</h1>
                    <p className="text-muted-foreground">Screening performance assessment.</p>
                  </div>

                  <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm">
                    {/* Primary Score */}
                    <div className="flex items-center gap-6 p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
                      <div className={cn(
                        "relative flex items-center justify-center w-16 h-16 rounded-[var(--radius-md)] border",
                        isPassed ? "bg-[var(--success-color)]/10 border-[var(--success-color)]/20" : "bg-[var(--error-color)]/10 border-[var(--error-color)]/20"
                      )}>
                        <div className={cn(
                          "absolute inset-0 blur-md rounded-[var(--radius-md)]",
                          isPassed ? "bg-[var(--success-color)]/10" : "bg-[var(--error-color)]/10"
                        )} />
                        {isPassed ? (
                          <CheckCircle className="h-8 w-8 text-[var(--success-color)] relative z-10 fill-current" />
                        ) : (
                          <XCircle className="h-8 w-8 text-[var(--error-color)] relative z-10 fill-current" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Screening Score</div>
                        <div className="text-4xl font-black" style={{ color: getScoreColor(report.screening_score) }}>
                          {formatScore(report.screening_score).value}<span className="text-2xl opacity-70 ml-1">{formatScore(report.screening_score).unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Evaluation Section */}
                {report.screening_evaluation && (
                  <div id="scr-evaluation" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-3xl font-bold text-foreground tracking-tight">Evaluation</h1>
                      <p className="text-muted-foreground">AI-generated screening summary.</p>
                    </div>

                    <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm flex flex-col gap-6">
                      <div className="p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <FileText className="h-5 w-5 text-[var(--primary-color)]" />
                          <h3 className="text-lg font-bold text-foreground">Summary</h3>
                        </div>
                        <p className="text-foreground/80 leading-relaxed text-[15px]">
                          {report.screening_evaluation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Answers Section */}
                {hasAnswers && (
                  <div id="scr-answers" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-3xl font-bold text-foreground tracking-tight">Screening Questions</h1>
                      <p className="text-muted-foreground">Candidate responses to screening questions.</p>
                    </div>

                    <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm flex flex-col gap-6">
                      {Object.entries(report.screening_answers!).map(([id, qa], idx) => (
                        <div key={id} className="p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 flex flex-col gap-5">
                          
                          {/* Header */}
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex flex-col flex-1 gap-3 pt-1">
                              <h4 className="text-foreground font-medium text-[15px] leading-relaxed">{qa.question_text}</h4>
                            </div>
                          </div>

                          <div className="h-px w-full bg-[var(--border-color-light)] dark:bg-white/5" />

                          {/* Response */}
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Response</span>
                            <div className="text-[15px] text-foreground/90 leading-relaxed bg-[var(--surface-1)] p-4 rounded-xl border border-[var(--border-color-light)] dark:border-white/5 border-l-4 border-l-[var(--primary-color)]">
                              {qa.answer}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }: { icon: ReportNavIcon; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-200 group",
        isActive ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)]" : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-[var(--primary-color)]" : "text-muted-foreground group-hover:text-foreground/70")} />
      <span className="font-medium text-[13px]">{label}</span>
    </div>
  );
}
