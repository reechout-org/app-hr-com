"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  MoreVertical,
  Search,
  User as UserIcon,
  Edit,
  Trash,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";

import { FloatingBtn } from "@/components/floating-btn";
import { questionnairesApi, type Questionnaire } from "@/lib/api/questionnaires";
import { cn } from "@/lib/ui/cn";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// Modal Components
import { DeleteQuestionnaireModal } from "./components/delete-questionnaire-modal";
import { UpdateQuestionnaireModal } from "./components/update-questionnaire-modal";
import { CreateQuestionnaireModal } from "./components/create-questionnaire-modal";

type ViewMode = "grid" | "list";

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? "" : val)}>
      <SelectTrigger className="h-10 min-w-[140px] rounded-xl bg-background shadow-sm border-border focus:ring-primary">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Any {label.toLowerCase()}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


import { Suspense } from "react";

function QuestionnairesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [questionsFilter, setQuestionsFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const targetClasses = 'border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09),0_1px_4px_rgba(var(--shadow-rgb),0.05)]';

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateModalOpen(true);
      // Clean up URL
      router.replace("/questionnaires", { scroll: false });
    }
  }, [searchParams, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["questionnaires", page, pageSize],
    queryFn: () => questionnairesApi.getQuestionnaires(page, pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionnairesApi.deleteQuestionnaire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
      setIsDeleteModalOpen(false);
      setSelectedQuestionnaire(null);
    },
  });

  // Mock mutations for create/update until they exist in the API layer
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // TODO: Call API
      console.log("Create Payload:", data);
      await new Promise((r) => setTimeout(r, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      // TODO: Call API
      console.log("Update Payload:", { id, title });
      await new Promise((r) => setTimeout(r, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
      setIsUpdateModalOpen(false);
      setSelectedQuestionnaire(null);
    },
  });

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (item: Questionnaire) => {
    setSelectedQuestionnaire(item);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (item: Questionnaire) => {
    setSelectedQuestionnaire(item);
    setIsDeleteModalOpen(true);
  };

  const filteredQuestionnaires = useMemo(() => {
    if (!data?.results) return [];
    let results = data.results;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(
        (q) =>
          q.title?.toLowerCase().includes(lowerQuery) ||
          q.details?.toLowerCase().includes(lowerQuery)
      );
    }
    
    return results;
  }, [data?.results, searchQuery]);

  const getStatusColor = (status: Questionnaire["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[var(--success-color-rgb)]/10 text-[var(--success-color)]";
      case "processing":
        return "bg-[var(--brand-blue-modern-rgb)]/10 text-[var(--brand-blue-modern)]";
      case "failed":
        return "bg-[var(--error-color-rgb)]/10 text-[var(--error-color)]";
      default: // pending
        return "bg-[var(--warning-color-rgb)]/10 text-[var(--warning-color)]";
    }
  };

  const getStatusText = (status: Questionnaire["status"]) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] pt-4 pb-8 sm:pt-6">
      {/* Background Decorative Gradient - inspired by nav aesthetic */}
      <div className="fixed inset-0 -z-10 bg-[var(--background-color)] bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary-color-rgb),0.05),transparent_60%)]" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-20">
        <div className={cn("flex w-full min-h-[52px] flex-col gap-4 rounded-[20px] py-3 px-[clamp(0.875rem,2.5vw,1.125rem)] sm:px-[clamp(1.125rem,3.5vw,1.5rem)] lg:px-[clamp(1.25rem,4vw,2rem)] md:flex-row md:items-center md:justify-between", targetClasses)}>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Created Date"
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { label: "Last 7 days", value: "7" },
                { label: "Last 30 days", value: "30" },
                { label: "Last 3 months", value: "90" },
                { label: "Last year", value: "365" },
              ]}
            />
            <FilterDropdown
              label="Questions"
              value={questionsFilter}
              onChange={setQuestionsFilter}
              options={[
                { label: "1-5 questions", value: "1-5" },
                { label: "6-10 questions", value: "6-10" },
                { label: "11-20 questions", value: "11-20" },
                { label: "20+ questions", value: "20+" },
              ]}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full max-w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl pl-9 bg-background border-border focus-visible:ring-primary placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            {/* View Toggle */}
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(val) => val && setViewMode(val as ViewMode)} 
              className="h-10 items-center rounded-xl border border-border bg-card p-1 shadow-sm gap-0"
            >
              <ToggleGroupItem 
                value="grid" 
                aria-label="Grid view" 
                className={cn("h-full w-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground")}
              >
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="list" 
                aria-label="List view" 
                className={cn("h-full w-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground")}
              >
                <ListIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div className={cn(isLoading && "opacity-60 pointer-events-none")}>
        {!isLoading && filteredQuestionnaires.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-muted)]">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">No questionnaires found</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {searchQuery ? "Try adjusting your search or filters." : "Click 'New Questionnaire' to create your first template."}
            </p>
          </div>
        ) : (
          <>
            {/* List View */}
            {viewMode === "list" && (
              <div className={cn("rounded-[20px] relative z-10", targetClasses)}>
                {/* Desktop Header */}
                <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1.2fr_80px] border-b border-[var(--border-color-light)] bg-black/5 px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] md:grid dark:bg-white/5 rounded-t-[20px]">
                  <div className="px-2">Questionnaire</div>
                  <div className="px-2">Created By</div>
                  <div className="px-2">Status</div>
                  <div className="px-2">Questions</div>
                  <div className="px-2">Date Added</div>
                  <div className="px-2 text-center">Manage</div>
                </div>
                
                {/* List Items */}
                <div className="flex flex-col divide-y divide-[var(--border-color-light)]">
                  {(isLoading ? Array(5).fill(null) : filteredQuestionnaires).map((item: Questionnaire | null, i) => (
                    <div
                      key={item?.id || i}
                      className={cn(
                        "group grid grid-cols-1 p-4 transition-colors hover:bg-black/5 md:grid-cols-[2fr_1fr_1fr_1fr_1.2fr_80px] md:px-6 md:py-4 dark:hover:bg-white/5 last:rounded-b-[20px]",
                        isLoading && "animate-pulse"
                      )}
                    >
                      {/* Title Cell */}
                      <div className="flex flex-col justify-center gap-1 px-2 md:pr-4">
                        {isLoading ? (
                          <>
                            <div className="h-5 w-3/4 rounded-md bg-[var(--border-color-light)]" />
                            <div className="h-4 w-1/2 rounded-md bg-[var(--border-color-light)] opacity-60" />
                          </>
                        ) : (
                          <>
                            <div className="truncate text-[15px] font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--text-accent-color)]">
                              {item!.title}
                            </div>
                            {item!.details && (
                              <div className="line-clamp-1 text-sm text-[var(--text-secondary)]">
                                {item!.details}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* User Cell */}
                      <div className="hidden items-center px-2 md:flex">
                        {isLoading ? (
                          <div className="h-8 w-24 rounded-full bg-[var(--border-color-light)]" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-color)]">
                              <UserIcon className="h-3.5 w-3.5" />
                            </div>
                            <span className="max-w-[120px] truncate text-sm font-medium text-[var(--text-primary)]">
                              {item!.user || "Unknown"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Cell */}
                      <div className="hidden items-center px-2 md:flex">
                        {isLoading ? (
                          <div className="h-6 w-20 rounded-full bg-[var(--border-color-light)]" />
                        ) : (
                          <span
                            className={cn(
                              "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase",
                              getStatusColor(item!.status)
                            )}
                          >
                            {getStatusText(item!.status)}
                          </span>
                        )}
                      </div>

                      {/* Questions Cell */}
                      <div className="hidden items-center px-2 md:flex">
                        {isLoading ? (
                          <div className="h-6 w-12 rounded-lg bg-[var(--border-color-light)]" />
                        ) : (
                          <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg bg-[var(--surface-2)] px-2.5 text-sm font-bold text-[var(--text-primary)] ring-1 ring-inset ring-[var(--border-color-light)]">
                            {item!.status === "processing" || item!.status === "failed"
                              ? "-"
                              : item!.number_of_questions}
                          </span>
                        )}
                      </div>

                      {/* Date Cell */}
                      <div className="hidden items-center px-2 md:flex">
                        {isLoading ? (
                          <div className="h-6 w-24 rounded-lg bg-[var(--border-color-light)]" />
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                            <Calendar className="h-4 w-4 opacity-70" />
                            {format(new Date(item!.created_at), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>

                      {/* Actions Cell */}
                      <div className="hidden items-center justify-center px-2 md:flex relative">
                        {isLoading ? (
                          <div className="h-8 w-8 rounded-xl bg-[var(--border-color-light)]" />
                        ) : (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32 rounded-xl">
                                <DropdownMenuItem onClick={() => handleEditClick(item!)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(item!)} className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>

                      {/* Mobile Only: Inline stats & actions */}
                      <div className="mt-4 flex items-center justify-between pt-1 md:hidden relative">
                        {isLoading ? (
                          <div className="h-6 w-full rounded bg-[var(--border-color-light)] opacity-50" />
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                                  getStatusColor(item!.status)
                                )}
                              >
                                {getStatusText(item!.status)}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                                <Calendar className="h-3.5 w-3.5 opacity-70" />
                                {format(new Date(item!.created_at), "MMM d")}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32 rounded-xl">
                                <DropdownMenuItem onClick={() => handleEditClick(item!)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(item!)} className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(isLoading ? Array(8).fill(null) : filteredQuestionnaires).map((item: Questionnaire | null, i) => (
                  <div
                    key={item?.id || i}
                    className={cn(
                      cn("group relative flex flex-col overflow-hidden rounded-[20px] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--primary-color-rgb)]/30", targetClasses),
                      isLoading && "animate-pulse"
                    )}
                  >
                    {/* Accent border left */}
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-[var(--primary-color)] to-[var(--primary-color-rgb)]/60 opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    {isLoading ? (
                      <>
                        <div className="mb-2 h-6 w-3/4 rounded bg-[var(--border-color-light)]" />
                        <div className="mb-4 h-4 w-full rounded bg-[var(--border-color-light)] opacity-60" />
                        <div className="mt-auto flex flex-col gap-3">
                          <div className="h-8 w-full rounded-xl bg-[var(--border-color-light)] opacity-50" />
                          <div className="h-8 w-full rounded-xl bg-[var(--border-color-light)] opacity-50" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-1 flex items-start justify-between gap-2 relative">
                          <h3 className="line-clamp-1 text-base font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--text-accent-color)]">
                            {item!.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-xl">
                              <DropdownMenuItem onClick={() => handleEditClick(item!)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(item!)} className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {item!.details && (
                          <p className="mb-4 line-clamp-2 text-sm text-[var(--text-secondary)] opacity-85">
                            {item!.details}
                          </p>
                        )}

                        <div className="mt-auto flex flex-col gap-2 border-t border-[var(--border-color-light)] pt-4">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center rounded-xl px-2.5 py-0.5 text-[11px] font-semibold shadow-sm",
                                getStatusColor(item!.status)
                              )}
                            >
                              {getStatusText(item!.status)}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
                              <Calendar className="h-3 w-3 text-[var(--primary-color)]" />
                              {format(new Date(item!.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between rounded-xl border border-[var(--primary-color-rgb)]/10 bg-[var(--primary-color-rgb)]/5 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-3.5 w-3.5 text-[var(--primary-color)]" />
                              <span className="max-w-[100px] truncate text-xs font-semibold text-[var(--text-primary)]">
                                {item!.user || "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                Qs:
                              </span>
                              <span className="text-sm font-bold text-[var(--primary-color)]">
                                {item!.status === "processing" || item!.status === "failed"
                                  ? "-"
                                  : item!.number_of_questions}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && data?.count ? (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row pb-8">
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span>
                Showing{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {(page - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {Math.min(page * pageSize, data.count)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {data.count}
                </span>{" "}
                questionnaires
              </span>
              <div className="hidden sm:block">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1); // Reset to page 1 on size change
                  }}
                  className="h-8 rounded-xl border border-[var(--border-color-light)] bg-[var(--background-color)] px-2 text-sm text-[var(--text-secondary)] outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 items-center justify-center gap-1 rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-1)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(data.count / pageSize)}
                className="flex h-9 items-center justify-center gap-1 rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-1)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Renders only on mobile */}
      <FloatingBtn text="New Questionnaire" onClick={handleCreateNew} />

      {/* Modals */}
      <CreateQuestionnaireModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
      />

      <UpdateQuestionnaireModal
        isOpen={isUpdateModalOpen}
        isUpdating={updateMutation.isPending}
        questionnaire={selectedQuestionnaire}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={(title) => updateMutation.mutate({ id: selectedQuestionnaire!.id, title })}
      />

      <DeleteQuestionnaireModal
        isOpen={isDeleteModalOpen}
        isDeleting={deleteMutation.isPending}
        questionnaire={selectedQuestionnaire}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedQuestionnaire!.id)}
      />
    </div>
  );
}

export default function QuestionnairesPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent" />
      </div>
    }>
      <QuestionnairesDashboard />
    </Suspense>
  );
}
