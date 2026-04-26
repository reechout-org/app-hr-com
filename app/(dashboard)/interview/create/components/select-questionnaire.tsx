"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/ui/cn";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock interface for what the API will return
export interface QuestionnaireTemplate {
  id: string;
  title: string;
  details?: string;
  number_of_questions: number;
  created_at?: string;
}

const PAGE_SIZE = 5;

const MOCK_QUESTIONNAIRES: QuestionnaireTemplate[] = [
  { id: "1", title: "Software Engineer Assessment", details: "Core technical and behavioral questions for full-stack developers.", number_of_questions: 10, created_at: "2023-10-12T00:00:00Z" },
  { id: "2", title: "Customer Support Representative", details: "Evaluates empathy, communication clarity, and conflict resolution.", number_of_questions: 8, created_at: "2023-11-05T00:00:00Z" },
  { id: "3", title: "Sales Executive Pitch", details: "Standard behavioral assessment with questions on closing and resilience.", number_of_questions: 5, created_at: "2024-01-20T00:00:00Z" },
  { id: "4", title: "Marketing Manager", details: "Campaign management, creative strategy, and cross-functional communication.", number_of_questions: 7, created_at: "2024-02-15T00:00:00Z" },
  { id: "5", title: "Product Manager IC", details: "Prioritization, stakeholders, and discovery — behavioral and scenario-based.", number_of_questions: 9, created_at: "2024-03-01T00:00:00Z" },
  { id: "6", title: "Data Analyst", details: "SQL, metrics, and communicating findings to non-technical teams.", number_of_questions: 8, created_at: "2024-03-10T00:00:00Z" },
  { id: "7", title: "DevOps / SRE", details: "Reliability, on-call, incident response, and infrastructure ownership.", number_of_questions: 9, created_at: "2024-03-18T00:00:00Z" },
  { id: "8", title: "HR Generalist", details: "Hiring, employee relations, and policy in fast-paced environments.", number_of_questions: 6, created_at: "2024-04-02T00:00:00Z" },
  { id: "9", title: "Frontend Developer", details: "React, accessibility, and collaboration with design systems.", number_of_questions: 10, created_at: "2024-04-12T00:00:00Z" },
  { id: "10", title: "Backend Developer", details: "APIs, data modeling, performance, and production debugging.", number_of_questions: 10, created_at: "2024-04-20T00:00:00Z" },
  { id: "11", title: "Executive Assistant", details: "Calendar management, discretion, and high-volume coordination.", number_of_questions: 6, created_at: "2024-05-01T00:00:00Z" },
  { id: "12", title: "Retail Store Manager", details: "Operations, people leadership, and customer experience under pressure.", number_of_questions: 7, created_at: "2024-05-15T00:00:00Z" },
];

interface SelectQuestionnaireProps {
  selectedId: string;
  onChange: (id: string) => void;
}

export function SelectQuestionnaire({ selectedId, onChange }: SelectQuestionnaireProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listPage, setListPage] = useState(1);

  const selectedTemplate = MOCK_QUESTIONNAIRES.find((q) => q.id === selectedId);

  const filteredQuestionnaires = useMemo(
    () =>
      MOCK_QUESTIONNAIRES.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (q.details && q.details.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      ),
    [searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredQuestionnaires.length / PAGE_SIZE));

  const pagedQuestionnaires = useMemo(() => {
    const start = (listPage - 1) * PAGE_SIZE;
    return filteredQuestionnaires.slice(start, start + PAGE_SIZE);
  }, [filteredQuestionnaires, listPage]);

  useEffect(() => {
    setListPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (listPage > totalPages) setListPage(totalPages);
  }, [listPage, totalPages]);

  useEffect(() => {
    if (isModalOpen) setListPage(1);
  }, [isModalOpen]);

  return (
    <div className="flex flex-col gap-6 p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color-light)] dark:border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-bold">3</div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-3">
              Select Questionnaire <span className="text-[var(--error-color)] text-sm">*</span>
              {selectedTemplate && (
                <span className="flex items-center justify-center px-3 py-1 rounded-full bg-[var(--success-color)]/10 text-[var(--success-color)] text-[11px] uppercase tracking-wider font-bold">
                  Selected
                </span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">Choose the AI assessment script.</p>
          </div>
        </div>
        {!selectedTemplate && (
          <div className="flex items-center gap-3">
            <Button className="h-10 rounded-xl bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color-hover)]" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Select Questionnaire
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {!selectedTemplate ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[var(--surface-2)] rounded-[16px] border border-dashed border-[var(--border-color-light)] dark:border-white/10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--surface-3)] text-muted-foreground mb-4">
              <FileText className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-[16px] font-bold text-foreground mb-1">No questionnaire selected</h3>
            <p className="text-[13px] text-muted-foreground">Click &quot;Select Questionnaire&quot; to choose one</p>
          </div>
        ) : (
          <div className="flex flex-col rounded-[16px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b border-[var(--border-color-light)] dark:border-white/5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary-color)]/10 text-[var(--primary-color)] shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-[16px] font-bold text-foreground leading-tight">
                    {selectedTemplate.title}
                  </h4>
                  {selectedTemplate.details && (
                    <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl">
                      {selectedTemplate.details}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                      <HelpCircle className="h-4 w-4" />
                      <span>{selectedTemplate.number_of_questions} Questions</span>
                    </div>
                    {selectedTemplate.created_at && (
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(selectedTemplate.created_at), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-[var(--error-color)] hover:bg-[var(--error-color)]/10 rounded-lg -mt-1 -mr-1"
                onClick={() => onChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-end p-3 bg-[var(--surface-1)]">
              <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[var(--primary-color)] hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10" onClick={() => setIsModalOpen(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Change Questionnaire
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09] flex flex-col">
          
          <div className="flex items-center justify-between border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09] shrink-0">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-xl font-bold text-foreground">
                Select Questionnaire
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            
            {/* Search Area */}
            <div className="p-6 pb-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questionnaires..."
                  className="h-14 w-full pl-12 rounded-[var(--radius-md)] bg-[var(--surface-2)] border-[var(--border-color-light)] dark:border-white/5 text-[15px] shadow-sm"
                />
              </div>

              {searchQuery.trim() && (
                <div className="mt-4 flex items-center justify-between px-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Found {filteredQuestionnaires.length} questionnaire
                    {filteredQuestionnaires.length !== 1 ? "s" : ""}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-[var(--primary-color)]"
                    onClick={() => setSearchQuery("")}
                    type="button"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>

            {/* List Area */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 p-6 pt-4">
              {filteredQuestionnaires.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <FileText className="mb-4 h-10 w-10 opacity-30" />
                  <p>No questionnaires match your search.</p>
                </div>
              ) : (
                <>
                  {pagedQuestionnaires.map((q) => (
                    <div
                      key={q.id}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onChange(q.id);
                          setIsModalOpen(false);
                        }
                      }}
                      onClick={() => {
                        onChange(q.id);
                        setIsModalOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-[16px] border-2 p-5 transition-all",
                        selectedId === q.id
                          ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5"
                          : "border-[var(--border-color-light)] bg-[var(--surface-2)] hover:border-[var(--primary-color)]/30 dark:border-white/5"
                      )}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-3)]">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="truncate text-[16px] font-bold leading-tight text-foreground">
                            {q.title}
                          </h4>
                          {selectedId === q.id && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--primary-color)]" />
                          )}
                        </div>
                        {q.details && (
                          <p className="line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                            {q.details}
                          </p>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                            <HelpCircle className="h-4 w-4" />
                            <span>{q.number_of_questions} Questions</span>
                          </div>
                          {q.created_at && (
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(q.created_at), "MMM d, yyyy")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <div className="mt-1 flex items-center justify-between gap-3 border-t border-[var(--border-color-light)] pt-4 dark:border-white/10">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 rounded-lg"
                        disabled={listPage <= 1}
                        onClick={() => setListPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {listPage} of {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 rounded-lg"
                        disabled={listPage >= totalPages}
                        onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}