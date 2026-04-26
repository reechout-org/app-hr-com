"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { 
  Check, 
  CheckCircle, 
  Code, 
  DollarSign,
  AlertCircle as ExclamationCircle, 
  FileText, 
  Heart, 
  Lightbulb, 
  MessageSquare, 
  Star, 
  User as UserIcon, 
  Users, 
  AlertTriangle as Warning,
  XCircle,
  Calendar,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/ui/cn";

import { interviewsApi, type InterviewCandidate } from "@/lib/api/interviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: InterviewCandidate | null;
}

type SectionKey = 'scores' | 'summary' | 'technical' | 'behavioral' | 'communication' | 'cultural_fit' | 'questions' | 'details';

export function AiReportModal({
  isOpen,
  onClose,
  candidate,
}: AiReportModalProps) {
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["candidate-report", candidate?.id],
    queryFn: () => interviewsApi.getCandidateReport(candidate!.id!),
    enabled: isOpen && !!candidate?.id,
  });

  const [activeSection, setActiveSection] = useState<SectionKey>('scores');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll spy logic
  const handleScroll = () => {
    const sections: SectionKey[] = ['scores', 'summary', 'technical', 'behavioral', 'communication', 'cultural_fit', 'questions', 'details'];
    
    let currentActive: SectionKey = 'scores';
    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        // If the top of the section is within the top 200px of the scrolling container
        if (rect.top <= 300) {
          currentActive = section;
        }
      }
    }
    setActiveSection(currentActive);
  };

  const scrollToSection = (id: SectionKey) => {
    const el = document.getElementById(id);
    const container = scrollRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      
      // Calculate relative position within the scroll container
      const scrollTop = elRect.top - containerRect.top + container.scrollTop - 20; // 20px padding
      
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (!candidate) return null;

  const candidateInitials = `${candidate.first_name?.[0] || ''}${candidate.last_name?.[0] || ''}`.toUpperCase();

  // Helper functions for coloring (mimics Angular getScoreColor/getColorForValue)
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

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return "-";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1200px] w-[95vw] h-[85vh] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09] flex flex-col">
        
        {/* Angular matched wrapper classes */}
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
                {report?.ai_summary && (
                  <NavItem 
                    icon={FileText} 
                    label="Summary" 
                    isActive={activeSection === 'summary'} 
                    onClick={() => scrollToSection('summary')} 
                  />
                )}
              </div>

              {/* Assessment */}
              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 px-3">Assessment</div>
                <NavItem 
                  icon={Code} 
                  label="Technical Analysis" 
                  isActive={activeSection === 'technical'} 
                  onClick={() => scrollToSection('technical')} 
                />
                <NavItem 
                  icon={Users} 
                  label="Behavioral Analysis" 
                  isActive={activeSection === 'behavioral'} 
                  onClick={() => scrollToSection('behavioral')} 
                />
                <NavItem 
                  icon={MessageSquare} 
                  label="Communication Analysis" 
                  isActive={activeSection === 'communication'} 
                  onClick={() => scrollToSection('communication')} 
                />
                {(report?.cultural_fit_summary || report?.cultural_fit_score) && (
                  <NavItem 
                    icon={Heart} 
                    label="Cultural Fit Analysis" 
                    isActive={activeSection === 'cultural_fit'} 
                    onClick={() => scrollToSection('cultural_fit')} 
                  />
                )}
              </div>

              {/* Details */}
              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 px-3">Details</div>
                {report?.question_evaluations && report.question_evaluations.length > 0 && (
                  <NavItem 
                    icon={HelpCircleIcon} 
                    label="Question Breakdown" 
                    isActive={activeSection === 'questions'} 
                    onClick={() => scrollToSection('questions')} 
                  />
                )}
                <NavItem 
                  icon={UserIcon} 
                  label="Candidate Details" 
                  isActive={activeSection === 'details'} 
                  onClick={() => scrollToSection('details')} 
                />
              </div>
            </div>
            
            {/* Close Button at bottom of sidebar */}
            <div className="p-4 border-t border-[var(--border-color-light)] dark:border-white/10">
              <Button variant="ghost" onClick={onClose} className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)] rounded-xl">
                <XCircle className="h-4 w-4 mr-2" />
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
                <p>Unable to load the report. It may still be processing.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-12 max-w-[900px] mx-auto relative z-10 pb-20">
                
                {/* 1. Score Section */}
                <div id="scores" className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Score</h1>
                    <p className="text-muted-foreground">Overall performance assessment based on interview responses.</p>
                  </div>

                  <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm">
                    {/* Primary Score */}
                    <div className="flex items-center gap-6 p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 mb-6">
                      <div className="relative flex items-center justify-center w-16 h-16 rounded-[var(--radius-md)] bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20">
                        <div className="absolute inset-0 bg-[var(--primary-color)]/10 blur-md rounded-[var(--radius-md)]" />
                        <Star className="h-8 w-8 text-[var(--primary-color)] relative z-10 fill-current" />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Overall Score</div>
                        <div className="text-4xl font-black" style={{ color: getScoreColor(report.score) }}>
                          {formatScore(report.score).value}<span className="text-2xl opacity-70 ml-1">{formatScore(report.score).unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Scores Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SecondaryScoreCard 
                        icon={Code} 
                        label="Technical" 
                        score={report.technical_score} 
                        color={getScoreColor(report.technical_score)} 
                      />
                      <SecondaryScoreCard 
                        icon={Users} 
                        label="Behavioral" 
                        score={report.behavioral_score} 
                        color={getScoreColor(report.behavioral_score)} 
                      />
                      <SecondaryScoreCard 
                        icon={MessageSquare} 
                        label="Communication" 
                        score={report.communication_score} 
                        color={getScoreColor(report.communication_score)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Summary Section */}
                {report.ai_summary && (
                  <div id="summary" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-3xl font-bold text-foreground tracking-tight">Summary</h1>
                      <p className="text-muted-foreground">AI-generated assessment based on interview responses.</p>
                    </div>

                    <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm flex flex-col gap-6">
                      
                      {report.ai_summary.overall_assessment && (
                        <div className="p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <FileText className="h-5 w-5 text-[var(--primary-color)]" />
                            <h3 className="text-lg font-bold text-foreground">Overall Assessment</h3>
                          </div>
                          <p className="text-foreground/80 leading-relaxed text-[15px]">
                            {report.ai_summary.overall_assessment}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {report.ai_summary.key_strengths && report.ai_summary.key_strengths.length > 0 && (
                          <div className="p-6 rounded-[20px] bg-[var(--success-color)]/10 border border-[var(--success-color)]/20">
                            <div className="flex items-center gap-3 mb-4">
                              <CheckCircle className="h-5 w-5 text-[var(--success-color)] fill-current" />
                              <h3 className="text-lg font-bold text-[var(--success-color)]">Key Strengths</h3>
                            </div>
                            <ul className="space-y-3">
                              {report.ai_summary.key_strengths.map((str, i) => (
                                <li key={i} className="flex items-start gap-3 text-foreground/80 text-[15px]">
                                  <Check className="h-5 w-5 shrink-0 text-[var(--success-color)]/70 mt-[2px]" />
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {report.ai_summary.job_fit && (
                          <div className="p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                              <UserIcon className="h-5 w-5 text-[var(--primary-color)]" />
                              <h3 className="text-lg font-bold text-foreground">Job Fit</h3>
                            </div>
                            <p className="text-foreground/80 leading-relaxed text-[15px]">
                              {report.ai_summary.job_fit}
                            </p>
                          </div>
                        )}
                      </div>

                      {report.ai_summary.recommendations && (
                        <div className="p-6 rounded-[20px] bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/30">
                          <div className="flex items-center gap-3 mb-4">
                            <LightbulbIcon className="h-5 w-5 text-[var(--primary-color)] fill-current" />
                            <h3 className="text-lg font-bold text-[var(--primary-color)]">Recommendation</h3>
                          </div>
                          <p className="text-foreground/90 leading-relaxed text-[15px]">
                            {report.ai_summary.recommendations}
                          </p>
                        </div>
                      )}

                      {report.ai_summary.areas_of_concern && report.ai_summary.areas_of_concern.length > 0 && (
                        <div className="p-6 rounded-[20px] bg-[var(--error-color)]/10 border border-[var(--error-color)]/20">
                          <div className="flex items-center gap-3 mb-4">
                            <WarningIcon className="h-5 w-5 text-[var(--error-color)] fill-current" />
                            <h3 className="text-lg font-bold text-[var(--error-color)]">Areas of Concern</h3>
                            <span className="ml-auto bg-[var(--error-color)]/20 text-[var(--error-color)] px-2.5 py-0.5 rounded-full text-xs font-bold">
                              {report.ai_summary.areas_of_concern.length}
                            </span>
                          </div>
                          <ul className="space-y-3">
                            {report.ai_summary.areas_of_concern.map((concern, i) => (
                              <li key={i} className="flex items-start gap-3 text-foreground/80 text-[15px]">
                                <ExclamationCircle className="h-5 w-5 shrink-0 text-[var(--error-color)]/70 mt-[2px]" />
                                <span>{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Technical Analysis */}
                {(report.technical_summary || report.technical_score) && (
                  <AnalysisSection 
                    id="technical"
                    title="Technical Analysis"
                    subtitle="Assessment of technical skills and competencies."
                    icon={Code}
                    score={report.technical_score}
                    summary={report.technical_summary}
                    skills={report.ai_summary?.technical_skills}
                  />
                )}

                {/* 4. Behavioral Analysis */}
                {(report.behavioral_summary || report.behavioral_score) && (
                  <AnalysisSection 
                    id="behavioral"
                    title="Behavioral Analysis"
                    subtitle="Assessment of behavioral competencies and soft skills."
                    icon={Users}
                    score={report.behavioral_score}
                    summary={report.behavioral_summary}
                  />
                )}

                {/* 5. Communication Analysis */}
                {(report.communication_summary || report.communication_score) && (
                  <AnalysisSection 
                    id="communication"
                    title="Communication Analysis"
                    subtitle="Assessment of communication skills and clarity."
                    icon={MessageSquare}
                    score={report.communication_score}
                    summary={report.communication_summary}
                  />
                )}

                {/* 6. Cultural Fit Analysis */}
                {(report.cultural_fit_summary || report.cultural_fit_score) && (
                  <AnalysisSection 
                    id="cultural_fit"
                    title="Cultural Fit Analysis"
                    subtitle="Assessment of cultural alignment and organizational fit."
                    icon={Heart}
                    score={report.cultural_fit_score}
                    summary={report.cultural_fit_summary}
                  />
                )}

                {/* 7. Question Breakdown */}
                {report.question_evaluations && report.question_evaluations.length > 0 && (
                  <div id="questions" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-3xl font-bold text-foreground tracking-tight">Question Breakdown</h1>
                      <p className="text-muted-foreground">Detailed evaluation of candidate responses to interview questions.</p>
                    </div>

                    <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm flex flex-col gap-6">
                      {report.question_evaluations.map((qe, idx) => (
                        <div key={idx} className="p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 flex flex-col gap-5">
                          
                          {/* Header */}
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-[var(--primary-color)]/20 text-[var(--primary-color)] font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex flex-col flex-1 gap-3">
                              <h4 className="text-foreground font-medium text-[16px] leading-relaxed">{qe.question_text}</h4>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--surface-3)] text-muted-foreground border border-[var(--border-color-light)] dark:border-white/10">
                                  {qe.question_type}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-xs font-bold tracking-wider" style={{ backgroundColor: `${getScoreColor(qe.score)}20`, color: getScoreColor(qe.score) }}>
                                  {qe.score}% Score
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="h-px w-full bg-[var(--border-color-light)] dark:bg-white/5" />

                          {/* Response Quality */}
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Response Quality</span>
                            <div className="flex items-center gap-2 text-[15px] text-foreground/90">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getScoreColor(qe.score) }} />
                              {qe.response_quality}
                            </div>
                          </div>

                          {/* Key Points & Concerns */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {qe.key_points && qe.key_points.length > 0 && (
                              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--success-color)]/10 border border-[var(--success-color)]/20">
                                <div className="flex items-center gap-2 text-[var(--success-color)] font-bold text-sm">
                                  <CheckCircle className="h-4 w-4" /> Key Points
                                </div>
                                <ul className="space-y-2">
                                  {qe.key_points.map((kp, i) => <li key={i} className="text-foreground/80 text-sm flex gap-2"><span className="text-[var(--success-color)]/50">•</span> {kp}</li>)}
                                </ul>
                              </div>
                            )}

                            {qe.concerns && qe.concerns.length > 0 && (
                              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--error-color)]/10 border border-[var(--error-color)]/20">
                                <div className="flex items-center gap-2 text-[var(--error-color)] font-bold text-sm">
                                  <ExclamationCircle className="h-4 w-4" /> Concerns
                                </div>
                                <ul className="space-y-2">
                                  {qe.concerns.map((con, i) => <li key={i} className="text-foreground/80 text-sm flex gap-2"><span className="text-[var(--error-color)]/50">•</span> {con}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. Candidate Details */}
                <div id="details" className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Candidate Details</h1>
                    <p className="text-muted-foreground">Additional information about the candidate.</p>
                  </div>

                  <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Questions Answered */}
                      {(report.questions_answered !== null && report.total_questions !== null) && (
                        <DetailCard title="Questions Answered" icon={HelpCircleIcon}>
                          <DetailRow label="Answered" value={`${report.questions_answered} / ${report.total_questions}`} isLarge />
                          {report.question_coverage && <DetailRow label="Coverage" value={`${report.question_coverage}%`} />}
                          {report.duration_seconds && <DetailRow label="Duration" value={formatDuration(report.duration_seconds)} />}
                        </DetailCard>
                      )}

                      {/* Experience */}
                      {(report.total_experience_years || report.notice_period_days !== null || report.availability_date) && (
                        <DetailCard title="Experience & Availability" icon={Calendar}>
                          {report.total_experience_years && <DetailRow label="Total Experience" value={`${report.total_experience_years} years`} />}
                          {report.notice_period_days !== null && <DetailRow label="Notice Period" value={`${report.notice_period_days} days`} />}
                          {report.availability_date && <DetailRow label="Availability Date" value={report.availability_date} />}
                        </DetailCard>
                      )}

                      {/* Compensation */}
                      {((report.expected_salary_min && report.expected_salary_max) || report.current_location || report.current_ctc) && (
                        <DetailCard title="Compensation & Location" icon={DollarSign}>
                          {report.current_ctc && <DetailRow label="Current CTC" value={`$${report.current_ctc}`} />}
                          {(report.expected_salary_min && report.expected_salary_max) && <DetailRow label="Expected Salary" value={`$${report.expected_salary_min} - $${report.expected_salary_max}`} />}
                          {report.current_location && <DetailRow label="Current Location" value={report.current_location} />}
                        </DetailCard>
                      )}

                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-components & Icons                                                     */
/* -------------------------------------------------------------------------- */

function NavItem({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) {
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

function SecondaryScoreCard({ icon: Icon, label, score, color }: { icon: React.ElementType, label: string, score?: string | number | null, color: string }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--surface-3)]">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">{label}</span>
        <div className="text-2xl font-bold" style={{ color: score !== null && score !== undefined ? color : 'var(--text-secondary)' }}>
          {score !== null && score !== undefined ? score : '-'}<span className="text-lg opacity-70 ml-1">{score !== null && score !== undefined ? '%' : ''}</span>
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({ id, title, subtitle, icon: Icon, score, summary, skills }: { id: string, title: string, subtitle: string, icon: React.ElementType, score?: string | number | null, summary?: string | null, skills?: string[] | null }) {
  const getScoreColor = (s: number | string | null | undefined) => {
    if (!s) return "var(--text-secondary)";
    const num = typeof s === 'string' ? parseFloat(s) : s;
    if (num >= 70) return "var(--success-color)";
    if (num >= 40) return "var(--warning-color)";
    return "var(--error-color)";
  };
  
  const sColor = getScoreColor(score);
  const strokeDasharray = score ? `${(parseFloat(score as string) / 100) * 283} 283` : "0 283";

  return (
    <div id={id} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Circular Score */}
          <div className="flex flex-col items-center justify-center gap-4 w-full md:w-64 shrink-0 bg-[var(--surface-2)] rounded-[20px] border border-[var(--border-color-light)] dark:border-white/5 p-8">
            <div className="relative flex items-center justify-center w-[120px] h-[120px]">
              {/* SVG Circular Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-[var(--border-color-light)] dark:text-white/5" strokeWidth="6" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={sColor} 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-black" style={{ color: sColor }}>{score || '-'}</span>
                {score && <span className="text-sm font-medium text-muted-foreground">%</span>}
              </div>
            </div>
            <div className="text-muted-foreground text-sm font-semibold uppercase tracking-wider text-center">{title.replace(' Analysis', '')} Score</div>
          </div>

          {/* Right Summary */}
          <div className="flex flex-col flex-1 gap-6 p-8 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-[var(--primary-color)]" />
              <h3 className="text-xl font-bold text-foreground">Analysis Summary</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed text-[15px]">
              {summary || "No summary available."}
            </p>

            {skills && skills.length > 0 && (
              <div className="mt-4 pt-6 border-t border-[var(--border-color-light)] dark:border-white/10 flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Technical Skills Identified</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] border border-[var(--primary-color)]/20 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-[20px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--primary-color)]" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, isLarge }: { label: string, value: string | number, isLarge?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={cn("font-medium text-foreground/90", isLarge ? "text-2xl font-bold text-foreground" : "text-[15px]")}>{value}</span>
    </div>
  );
}

// Custom Icons mimicking Angular
function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return <HelpCircle {...props} />;
}
function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Lightbulb {...props} />;
}
function WarningIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Warning {...props} />;
}
