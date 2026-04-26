"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  ArrowLeft, X, Smartphone, Monitor, CalendarIcon, 
  Clock, Zap, Info, Plus, Trash2, Edit2, Upload, FileUp, 
  Search, FileText
} from "lucide-react";

import { interviewsApi, CreateInterviewRequest, AddCandidateRequest } from "@/lib/api/interviews";
import { questionnairesApi, Questionnaire } from "@/lib/api/questionnaires";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// --- Schema definitions ---
const candidateSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  notes: z.string().optional(),
});
type CandidateFormValues = z.infer<typeof candidateSchema>;

// Extend AddCandidateRequest locally if needed for the UI before sending
interface UICandidate extends Omit<AddCandidateRequest, 'interview_id' | 'schedule_date'> {
  id: string; // Ensure ID exists for UI lists
}

// --- Main Page Component ---
export default function CreateInterviewPage() {
  const router = useRouter();

  // State
  const [candidates, setCandidates] = useState<UICandidate[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  
  // Job Requirements
  const [interviewType, setInterviewType] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  // Schedule
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState<string>("");

  // UI Modals
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isSelectQuestionnaireOpen, setIsSelectQuestionnaireOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<UICandidate | null>(null);

  // Queries
  const { data: questionnairesData, isLoading: isLoadingQuestionnaires } = useQuery({
    queryKey: ["questionnaires"],
    queryFn: () => questionnairesApi.getQuestionnaires(1, 50), // Fetch up to 50 for simplicity
  });

  // Mutations
  const createInterviewMutation = useMutation({
    mutationFn: async (data: CreateInterviewRequest) => {
      // Assuming a generic API client or specific function exists. 
      // The API doesn't expose 'createInterview' yet in interviews.ts, I might need to add it,
      // but let's mock the payload structure based on Angular.
      // We will add `createInterview` to `interviews.ts` next.
      return await interviewsApi.createInterview(data);
    },
    onSuccess: () => {
      toast.success(
        scheduleType === "now"
          ? "Interview started successfully"
          : "Interview scheduled successfully"
      );
      router.push("/interviews");
    },
    onError: (error) => {
      toast.error("Failed to create interview. Please try again.");
      console.error(error);
    }
  });

  // Actions
  const handleSaveCandidate = (data: CandidateFormValues) => {
    if (editingCandidate) {
      setCandidates(cands => cands.map(c => c.id === editingCandidate.id ? { ...data, id: editingCandidate.id } : c));
    } else {
      setCandidates(cands => [...cands, { ...data, id: crypto.randomUUID() }]);
    }
    setIsAddCandidateOpen(false);
    setEditingCandidate(null);
  };

  const handleRemoveCandidate = (id: string) => {
    setCandidates(cands => cands.filter(c => c.id !== id));
  };

  const handleCreateInterview = () => {
    if (!selectedQuestionnaire) {
      toast.warning("Please select a questionnaire");
      return;
    }
    if (scheduleType === "later" && !scheduledDate) {
      toast.warning("Please select a date and time for the interview");
      return;
    }
    if (!deadline) {
      toast.warning("Please select an interview deadline");
      return;
    }

    const payloadScheduledDate = scheduleType === "later" ? new Date(scheduledDate).toISOString() : new Date().toISOString();
    const payloadDeadline = new Date(deadline).toISOString();

    const payload: CreateInterviewRequest = {
      questionnaire_id: selectedQuestionnaire.id,
      scheduled_date: payloadScheduledDate,
      candidates: candidates.map(c => ({
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        phone: c.phone,
        notes: c.notes,
        // Angular sends minimal candidate details in the array, adjusting to API expectations
      })),
      type: interviewType || undefined,
      deadline: payloadDeadline,
    };

    createInterviewMutation.mutate(payload);
  };

  // Forms
  const candidateForm = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      notes: "",
    }
  });

  const openCandidateModal = (candidate?: UICandidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      candidateForm.reset(candidate);
    } else {
      setEditingCandidate(null);
      candidateForm.reset({ first_name: "", last_name: "", email: "", phone: "", notes: "" });
    }
    setIsAddCandidateOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[1400px] p-[clamp(1rem,3vw,2rem)] flex flex-col gap-6 lg:gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="outline" onClick={() => router.push("/interviews")} className="gap-2 h-8 rounded-[var(--radius-md)] px-3 border-[var(--header-floating-border)] bg-background text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="w-4 h-4" /> Back to Interviews
              </Button>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Create New Interview</h1>
            <p className="text-sm text-[var(--text-secondary)]">Configure job requirements, select a questionnaire, and add candidates.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push("/interviews")} className="h-10 w-10 rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-destructive hidden sm:flex">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Job Requirements */}
        <section className="rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-5 shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] sm:p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Job Requirements</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Define the format and timeline for this interview.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <Smartphone className="w-4 h-4 text-[var(--primary-color)]" /> Interview Type
              </Label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger className="h-10 w-full rounded-xl bg-background border-[var(--header-floating-border)] focus:ring-[var(--primary-color)] shadow-sm">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile"><div className="flex items-center gap-2"><Smartphone className="w-4 h-4"/> Mobile App</div></SelectItem>
                  <SelectItem value="web"><div className="flex items-center gap-2"><Monitor className="w-4 h-4"/> Web Browser</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="flex items-center justify-between text-sm font-medium text-[var(--text-primary)]">
                <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-[var(--primary-color)]" /> Interview Deadline</span>
                <span className="text-xs font-normal text-[var(--error-color)]">Required</span>
              </Label>
              <Input 
                type="datetime-local" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="h-10 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm"
              />
              <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                <Info className="w-3 h-3" /> Candidates must complete the interview before this date.
              </p>
            </div>
          </div>
        </section>

        {/* Candidates & Questionnaire */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Questionnaire Selection */}
          <section className="rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-5 shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] sm:p-6 md:p-8 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Questionnaire</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Select the evaluation criteria for the candidates.</p>
              </div>
              <span className="text-xs font-medium bg-[var(--error-color)]/10 text-[var(--error-color)] px-2.5 py-1 rounded-full">Required</span>
            </div>

            {selectedQuestionnaire ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-[var(--header-floating-border)] rounded-[var(--radius-md)] p-6 sm:p-8 text-center bg-background shadow-sm transition-all hover:border-[rgba(var(--primary-color-rgb),0.28)]">
                <div className="bg-[var(--primary-color)]/10 text-[var(--primary-color)] p-4 rounded-full mb-4 ring-4 ring-[var(--primary-color)]/5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1 truncate w-full max-w-[90%]">{selectedQuestionnaire.title}</h3>
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] mb-6">
                  <span className={cn("px-2 py-0.5 rounded-md", selectedQuestionnaire.status === "completed" ? "bg-[var(--success-color)]/10 text-[var(--success-color)]" : "bg-[var(--warning-color)]/10 text-[var(--warning-color)]")}>
                    {selectedQuestionnaire.status === "completed" ? "Published" : "Draft"}
                  </span>
                  <span>•</span>
                  <span>{new Date(selectedQuestionnaire.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 w-full max-w-[240px]">
                  <Button variant="outline" className="flex-1 h-9 rounded-xl border-[var(--header-floating-border)] bg-background text-[var(--text-secondary)] hover:bg-[var(--surface-2)]" onClick={() => setIsSelectQuestionnaireOpen(true)}>Change</Button>
                  <Button variant="ghost" className="flex-1 h-9 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => setSelectedQuestionnaire(null)}>Remove</Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--header-floating-border)] rounded-[var(--radius-md)] p-8 text-center text-[var(--text-secondary)] bg-background/50 hover:bg-background transition-colors">
                <div className="bg-[var(--surface-2)] p-4 rounded-full mb-4 text-[var(--text-muted)]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">No Questionnaire Selected</h3>
                <p className="text-sm mb-6 max-w-[280px]">You must select a questionnaire to establish the evaluation criteria.</p>
                <Button className="h-10 rounded-xl px-5 shadow-sm bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white" onClick={() => setIsSelectQuestionnaireOpen(true)}>
                  <Search className="w-4 h-4 mr-2" /> Browse Questionnaires
                </Button>
              </div>
            )}
          </section>

          {/* Candidates */}
          <section className="rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-5 shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] sm:p-6 md:p-8 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  Candidates 
                  <span className="text-xs bg-[var(--primary-color)]/10 text-[var(--primary-color)] px-2.5 py-0.5 rounded-full font-bold">{candidates.length}</span>
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Add candidates to invite to this interview.</p>
              </div>
              {candidates.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => openCandidateModal()} className="h-8 rounded-lg border-[var(--header-floating-border)] text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              )}
            </div>
            
            {candidates.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--header-floating-border)] rounded-[var(--radius-md)] p-8 text-center text-[var(--text-secondary)] bg-background/50">
                <div className="bg-[var(--surface-2)] p-4 rounded-full mb-4 text-[var(--text-muted)]">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">No Candidates Added</h3>
                <p className="text-sm mb-6 max-w-[260px]">Add candidates manually to invite them to this interview.</p>
                <Button variant="outline" className="h-10 rounded-xl px-5 border-[var(--header-floating-border)] bg-background hover:bg-[var(--surface-2)] text-[var(--text-primary)] shadow-sm" onClick={() => openCandidateModal()}>
                  <Plus className="w-4 h-4 mr-2" /> Add First Candidate
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex flex-col gap-2 mb-4 max-h-[320px] overflow-y-auto pr-1">
                  {candidates.map(candidate => (
                    <div key={candidate.id} className="group flex items-center justify-between p-3.5 border border-[var(--header-floating-border)] rounded-xl bg-background shadow-sm transition-all hover:border-[rgba(var(--primary-color-rgb),0.28)]">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{candidate.first_name} {candidate.last_name}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{candidate.email} <span className="mx-1">•</span> {candidate.phone}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-3 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10" onClick={() => openCandidateModal(candidate)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--text-secondary)] hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveCandidate(candidate.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Schedule */}
        <section className="rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-5 shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] sm:p-6 md:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Interview Schedule</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Choose when candidates should receive their invitations.</p>
            </div>
            <span className="text-xs font-medium bg-[var(--error-color)]/10 text-[var(--error-color)] px-2.5 py-1 rounded-full self-start sm:self-auto">Required</span>
          </div>

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className={cn(
                "group relative flex items-start gap-4 p-5 border rounded-[var(--radius-md)] cursor-pointer transition-all duration-200",
                scheduleType === "now" 
                  ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 ring-1 ring-[var(--primary-color)]/20" 
                  : "border-[var(--header-floating-border)] bg-background hover:border-[rgba(var(--primary-color-rgb),0.28)]"
              )}>
                <input 
                  type="radio" 
                  name="scheduleType" 
                  value="now" 
                  checked={scheduleType === "now"} 
                  onChange={() => setScheduleType("now")}
                  className="mt-1 flex-shrink-0 w-4 h-4 accent-[var(--primary-color)] text-[var(--primary-color)] border-gray-300 focus:ring-[var(--primary-color)]"
                />
                <div>
                  <div className={cn("font-semibold flex items-center gap-2 mb-1", scheduleType === "now" ? "text-[var(--primary-color)]" : "text-[var(--text-primary)]")}>
                    <Zap className={cn("w-4 h-4", scheduleType === "now" ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)]")} /> 
                    Start Immediately
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Candidates will receive the interview link right away and can begin.</p>
                </div>
              </label>

              <label className={cn(
                "group relative flex items-start gap-4 p-5 border rounded-[var(--radius-md)] cursor-pointer transition-all duration-200",
                scheduleType === "later" 
                  ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 ring-1 ring-[var(--primary-color)]/20" 
                  : "border-[var(--header-floating-border)] bg-background hover:border-[rgba(var(--primary-color-rgb),0.28)]"
              )}>
                <input 
                  type="radio" 
                  name="scheduleType" 
                  value="later" 
                  checked={scheduleType === "later"} 
                  onChange={() => setScheduleType("later")}
                  className="mt-1 flex-shrink-0 w-4 h-4 accent-[var(--primary-color)] text-[var(--primary-color)] border-gray-300 focus:ring-[var(--primary-color)]"
                />
                <div>
                  <div className={cn("font-semibold flex items-center gap-2 mb-1", scheduleType === "later" ? "text-[var(--primary-color)]" : "text-[var(--text-primary)]")}>
                    <Clock className={cn("w-4 h-4", scheduleType === "later" ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)]")} /> 
                    Schedule for Later
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Candidates will receive the interview link at a specified date and time.</p>
                </div>
              </label>
            </div>

            {scheduleType === "later" && (
              <div className="p-5 border border-[var(--header-floating-border)] rounded-[var(--radius-md)] bg-background flex flex-col sm:flex-row sm:items-center gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-1 flex flex-col gap-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                    <CalendarIcon className="w-4 h-4 text-[var(--primary-color)]" /> Select Date & Time
                  </Label>
                  <Input 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="h-10 rounded-xl bg-[var(--surface-2)] border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]"
                  />
                </div>
                <div className="flex-1 sm:pt-6">
                  <p className="text-sm text-[var(--text-secondary)] flex items-start gap-2 bg-[var(--primary-color)]/5 p-3 rounded-xl border border-[var(--primary-color)]/10 text-[var(--primary-color)]">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" /> 
                    <span>Invitations will be sent automatically at the selected time.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-2 pb-6 lg:pb-8">
          <Button variant="ghost" onClick={() => router.push("/interviews")} disabled={createInterviewMutation.isPending} className="h-11 px-6 rounded-xl text-[var(--text-secondary)] hover:text-foreground">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateInterview} 
            disabled={createInterviewMutation.isPending}
            className="h-11 px-8 rounded-xl font-semibold shadow-md bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] hover:shadow-[0_4px_14px_rgba(var(--primary-color-rgb),0.25)] hover:-translate-y-0.5 active:translate-y-0 text-white transition-all duration-200 min-w-[160px]"
          >
            {createInterviewMutation.isPending ? "Creating..." : "Create Interview"}
          </Button>
        </div>

      </div>

      {/* --- Modals --- */}
      
      {/* Add Candidate Modal */}
      <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] backdrop-blur-xl">
          <DialogHeader className="px-6 py-5 border-b border-[var(--header-floating-border)] bg-transparent">
            <DialogTitle className="text-xl font-bold">{editingCandidate ? "Edit Candidate" : "Add Candidate"}</DialogTitle>
            <DialogDescription className="text-sm text-[var(--text-secondary)] mt-1">Enter the candidate's contact details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={candidateForm.handleSubmit(handleSaveCandidate)} className="flex flex-col">
            <div className="px-6 py-6 space-y-5 bg-transparent">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-medium">First Name <span className="text-[var(--error-color)]">*</span></Label>
                  <Input id="first_name" {...candidateForm.register("first_name")} className="h-10 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" />
                  {candidateForm.formState.errors.first_name && <p className="text-xs text-[var(--error-color)]">{candidateForm.formState.errors.first_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-medium">Last Name <span className="text-[var(--error-color)]">*</span></Label>
                  <Input id="last_name" {...candidateForm.register("last_name")} className="h-10 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" />
                  {candidateForm.formState.errors.last_name && <p className="text-xs text-[var(--error-color)]">{candidateForm.formState.errors.last_name.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-[var(--error-color)]">*</span></Label>
                <Input id="email" type="email" {...candidateForm.register("email")} className="h-10 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" placeholder="candidate@example.com" />
                {candidateForm.formState.errors.email && <p className="text-xs text-[var(--error-color)]">{candidateForm.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number <span className="text-[var(--error-color)]">*</span></Label>
                <Input id="phone" type="tel" {...candidateForm.register("phone")} className="h-10 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" placeholder="+1 (555) 000-0000" />
                {candidateForm.formState.errors.phone && <p className="text-xs text-[var(--error-color)]">{candidateForm.formState.errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-[var(--text-secondary)]">Internal Notes (Optional)</Label>
                <Input id="notes" {...candidateForm.register("notes")} className="h-10 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" placeholder="E.g., Referred by John Doe" />
              </div>
            </div>
            <DialogFooter className="border-t border-[var(--header-floating-border)] bg-transparent sm:justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsAddCandidateOpen(false)} className="h-10 rounded-xl px-4 text-[var(--text-secondary)] hover:text-foreground">Cancel</Button>
              <Button type="submit" className="h-10 rounded-xl px-6 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white shadow-sm">{editingCandidate ? "Save Changes" : "Add Candidate"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Select Questionnaire Modal */}
      <Dialog open={isSelectQuestionnaireOpen} onOpenChange={setIsSelectQuestionnaireOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] backdrop-blur-xl">
          <DialogHeader className="px-6 py-5 border-b border-[var(--header-floating-border)] bg-transparent">
            <DialogTitle className="text-xl font-bold">Select Questionnaire</DialogTitle>
            <DialogDescription className="text-sm text-[var(--text-secondary)] mt-1">Choose the evaluation criteria to use for this interview.</DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-transparent">
            {isLoadingQuestionnaires ? (
              <div className="min-h-[200px] p-6" aria-hidden />
            ) : questionnairesData?.results.length ? (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {questionnairesData.results.map(q => (
                  <div 
                    key={q.id} 
                    className={cn(
                      "group flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200",
                      selectedQuestionnaire?.id === q.id 
                        ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 ring-1 ring-[var(--primary-color)]/20" 
                        : "border-[var(--header-floating-border)] bg-background hover:border-[rgba(var(--primary-color-rgb),0.28)]"
                    )}
                    onClick={() => {
                      setSelectedQuestionnaire(q);
                      setIsSelectQuestionnaireOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "mt-0.5 p-2 rounded-lg transition-colors", 
                        selectedQuestionnaire?.id === q.id ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)]" : "bg-[var(--surface-2)] text-[var(--text-secondary)] group-hover:text-[var(--primary-color)]"
                      )}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={cn("font-semibold text-base mb-1", selectedQuestionnaire?.id === q.id ? "text-[var(--primary-color)]" : "text-[var(--text-primary)]")}>{q.title}</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                          <span className={cn("px-2 py-0.5 rounded-md", q.status === "completed" ? "bg-[var(--success-color)]/10 text-[var(--success-color)]" : "bg-[var(--warning-color)]/10 text-[var(--warning-color)]")}>
                            {q.status === "completed" ? "Published" : "Draft"}
                          </span>
                          <span>•</span>
                          <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedQuestionnaire?.id === q.id ? "border-[var(--primary-color)]" : "border-[var(--text-muted)] group-hover:border-[var(--primary-color)]"
                    )}>
                      {selectedQuestionnaire?.id === q.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--header-floating-border)] rounded-[var(--radius-md)] p-10 text-center bg-background/50">
                <div className="bg-[var(--surface-2)] p-4 rounded-full mb-4 text-[var(--text-muted)]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">No Questionnaires Found</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-[280px]">You need to create a questionnaire before you can schedule an interview.</p>
                <Button className="h-10 rounded-xl px-5 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white shadow-sm" onClick={() => { setIsSelectQuestionnaireOpen(false); router.push("/questionnaires"); }}>
                  Create Questionnaire
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="border-t border-[var(--header-floating-border)] bg-transparent">
            <Button type="button" variant="outline" className="h-10 rounded-xl px-6 border-[var(--header-floating-border)] bg-background text-[var(--text-primary)] hover:bg-[var(--surface-2)]" onClick={() => setIsSelectQuestionnaireOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
