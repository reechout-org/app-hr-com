"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, CheckCircle2, AlertCircle, Loader2, CalendarCheck, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/ui/cn";
import { getCandidatePortal, updateCandidatePortal } from "@/lib/api/interviews";

interface SharePageProps {
  params: Promise<{ id: string; candidateId: string }>;
}

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CandidateSharePage({ params }: SharePageProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { id: interviewId, candidateId } = use(params);

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    preferredDateTime: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: candidateData, isLoading, isError, error } = useQuery({
    queryKey: ["candidate-share", candidateId, token],
    queryFn: () => {
      if (!candidateId || !token) throw new Error("Invalid link");
      return getCandidatePortal(candidateId, token);
    },
    enabled: !!candidateId && !!token,
    retry: false,
  });

  useEffect(() => {
    if (!candidateData) return;
    const preferredDate = candidateData.schedule_date
      ? toDatetimeLocalValue(new Date(candidateData.schedule_date))
      : "";
    setFormData({
      first_name: candidateData.first_name || "",
      last_name: candidateData.last_name || "",
      email: candidateData.email || "",
      phone: candidateData.phone || "",
      preferredDateTime: preferredDate,
      consent: false,
    });
  }, [candidateData]);

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!candidateId || !token || !interviewId) {
        throw new Error("Invalid link");
      }
      return updateCandidatePortal(candidateId, interviewId, token, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        schedule_date_iso: new Date(formData.preferredDateTime).toISOString(),
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Successfully updated your interview registration!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update your interview registration. Please try again.");
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim() || formData.first_name.length < 2) {
      newErrors.first_name = "Please input your first name!";
    }
    if (!formData.last_name.trim() || formData.last_name.length < 2) {
      newErrors.last_name = "Please input your last name!";
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address!";
    }
    if (!formData.phone.trim() || !/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please input your phone number!";
    }
    if (!formData.preferredDateTime) {
      newErrors.preferredDateTime = "Please select your preferred interview date and time!";
    }
    if (!formData.consent) {
      newErrors.consent = "You must provide consent to schedule the interview";
    }

    if (candidateData?.interview?.deadline && formData.preferredDateTime) {
      const selectedDate = new Date(formData.preferredDateTime);
      const deadlineDate = new Date(candidateData.interview.deadline);
      if (selectedDate > deadlineDate) {
        newErrors.preferredDateTime =
          "Selected date and time cannot be after the interview deadline!";
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.preferredDateTime) {
      const selected = new Date(formData.preferredDateTime);
      if (selected < today) {
        newErrors.preferredDateTime = "Please choose a date and time from today onward.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    submitMutation.mutate();
  };

  if (!candidateId || !token) {
    return (
      <div className="relative flex w-full flex-1 items-center justify-center p-4">
        <div className="pointer-events-none absolute -top-[120px] left-0 right-0 h-[420px] bg-gradient-to-b from-[var(--primary-color)]/5 to-transparent" />
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 rounded-[var(--radius-md)] border border-[var(--error-color)]/20 bg-[var(--header-floating-bg)] p-8 text-center shadow-[0_12px_40px_rgba(var(--error-color-rgb),0.05)] backdrop-blur-xl sm:p-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--error-color)]/10 ring-8 ring-[var(--error-color)]/5">
            <AlertCircle className="h-10 w-10 text-[var(--error-color)]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Invalid Link</h2>
          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Please use the exact link provided in your email invitation (including the access token).
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--primary-color)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative flex w-full flex-1 items-center justify-center p-4">
        <div className="pointer-events-none absolute -top-[120px] left-0 right-0 h-[420px] bg-gradient-to-b from-[var(--primary-color)]/5 to-transparent" />
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 rounded-[var(--radius-md)] border border-[var(--error-color)]/20 bg-[var(--header-floating-bg)] p-8 text-center shadow-[0_12px_40px_rgba(var(--error-color-rgb),0.05)] backdrop-blur-xl sm:p-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--error-color)]/10 ring-8 ring-[var(--error-color)]/5">
            <AlertCircle className="h-10 w-10 text-[var(--error-color)]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Access Denied</h2>
          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const interviewDeadline = candidateData?.interview?.deadline;
  const nowLocal = toDatetimeLocalValue(new Date());
  const deadlineLocalMax = interviewDeadline
    ? toDatetimeLocalValue(new Date(interviewDeadline))
    : undefined;

  const isCompleted = candidateData?.status === "completed";
  const isScheduled = candidateData?.status === "accepted" || candidateData?.status === "rescheduled";
  const showForm = !submitted && !isCompleted && !isScheduled;

  return (
    <div className="relative flex w-full flex-1 flex-col selection:bg-[var(--primary-color)]/30 py-12">
      <div className="pointer-events-none absolute -top-[120px] left-0 right-0 h-[420px] bg-gradient-to-b from-[var(--primary-color)]/5 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center p-4 sm:p-8">
        {submitted && (
          <div className="flex w-full max-w-lg flex-col items-center rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-8 text-center shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl sm:p-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--success-color)]/10 ring-8 ring-[var(--success-color)]/5">
              <CheckCircle2 className="h-12 w-12 text-[var(--success-color)]" />
            </div>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Registration Successful!
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Thank you for registering. You will receive a confirmation email shortly with further details about your interview.
            </p>
            <div className="w-full rounded-2xl border border-[var(--header-floating-border)] bg-[var(--surface-2)] p-6 text-left">
              <p className="flex items-start gap-2 text-[14px] font-medium leading-relaxed text-[var(--text-primary)]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-color)]" />
                <span>Please check your email for interview instructions and preparation materials.</span>
              </p>
            </div>
          </div>
        )}

        {!submitted && isCompleted && (
          <div className="flex w-full max-w-lg flex-col items-center rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-8 text-center shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl sm:p-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary-color)]/10 ring-8 ring-[var(--primary-color)]/5">
              <Info className="h-12 w-12 text-[var(--primary-color)]" />
            </div>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Interview Completed
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
              You have already completed this interview. Thank you for your time!
            </p>
            <div className="w-full rounded-2xl border border-[var(--header-floating-border)] bg-[var(--surface-2)] p-6 text-left">
              <p className="flex items-start gap-2 text-[14px] font-medium leading-relaxed text-[var(--text-primary)]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-color)]" />
                <span>The recruitment team is currently reviewing your results. You will be contacted if you are selected for the next stage.</span>
              </p>
            </div>
          </div>
        )}

        {!submitted && isScheduled && (
          <div className="flex w-full max-w-lg flex-col items-center rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-8 text-center shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl sm:p-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--success-color)]/10 ring-8 ring-[var(--success-color)]/5">
              <CalendarCheck className="h-12 w-12 text-[var(--success-color)]" />
            </div>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Interview Scheduled
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Your interview is scheduled for <span className="font-semibold text-[var(--text-primary)]">{candidateData.schedule_date ? format(new Date(candidateData.schedule_date), "MMM d, yyyy 'at' h:mm a") : 'Unknown date'}</span>.
            </p>
            <div className="w-full rounded-2xl border border-[var(--header-floating-border)] bg-[var(--surface-2)] p-6 text-left">
              <p className="flex items-start gap-2 text-[14px] font-medium leading-relaxed text-[var(--text-primary)]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-color)]" />
                <span>Please check your email for interview instructions and preparation materials. If you need to reschedule, please contact the recruitment team.</span>
              </p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="relative flex w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl">
            <div className="border-b border-[var(--header-floating-border)] bg-transparent px-6 py-6 sm:px-8 sm:pb-6 sm:pt-8">
              <div className="mb-3 inline-flex items-center rounded-md bg-[var(--primary-color)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--primary-color)]">
                Interview Registration
              </div>
              <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Your Information
              </h2>
              <p className="text-[14px] text-[var(--text-secondary)] sm:text-[15px]">
                Please provide your details to schedule your interview.
              </p>
            </div>

            <div className="bg-transparent p-6 sm:p-8">
              {interviewDeadline && (
                <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[var(--warning-color)]/20 bg-[var(--warning-color)]/10 p-4 text-[var(--warning-color)] sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--warning-color)]/20">
                    <Clock className="h-5 w-5 text-[var(--warning-color)]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Interview Deadline</span>
                    <span className="text-[15px] font-bold">
                      {format(new Date(interviewDeadline), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      First Name <span className="text-[var(--error-color)]">*</span>
                    </Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="e.g. Emily"
                      className={cn(
                        "h-12 rounded-xl border-[var(--header-floating-border)] bg-background px-4 text-[15px] shadow-sm focus-visible:ring-[var(--primary-color)]",
                        errors.first_name && "border-[var(--error-color)] focus-visible:ring-[var(--error-color)]"
                      )}
                    />
                    {errors.first_name && (
                      <span className="text-xs font-medium text-[var(--error-color)]">{errors.first_name}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      Last Name <span className="text-[var(--error-color)]">*</span>
                    </Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="e.g. Chen"
                      className={cn(
                        "h-12 rounded-xl border-[var(--header-floating-border)] bg-background px-4 text-[15px] shadow-sm focus-visible:ring-[var(--primary-color)]",
                        errors.last_name && "border-[var(--error-color)] focus-visible:ring-[var(--error-color)]"
                      )}
                    />
                    {errors.last_name && (
                      <span className="text-xs font-medium text-[var(--error-color)]">{errors.last_name}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Email Address <span className="text-[var(--error-color)]">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="emily@example.com"
                    className={cn(
                      "h-12 rounded-xl border-[var(--header-floating-border)] bg-background px-4 text-[15px] shadow-sm focus-visible:ring-[var(--primary-color)]",
                      errors.email && "border-[var(--error-color)] focus-visible:ring-[var(--error-color)]"
                    )}
                  />
                  {errors.email && (
                    <span className="text-xs font-medium text-[var(--error-color)]">{errors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Phone Number <span className="text-[var(--error-color)]">*</span>
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="555 123 4567"
                    className={cn(
                      "h-12 rounded-xl border-[var(--header-floating-border)] bg-background px-4 text-[15px] shadow-sm focus-visible:ring-[var(--primary-color)]",
                      errors.phone && "border-[var(--error-color)] focus-visible:ring-[var(--error-color)]"
                    )}
                  />
                  {errors.phone && (
                    <span className="text-xs font-medium text-[var(--error-color)]">{errors.phone}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Preferred Interview Date & Time <span className="text-[var(--error-color)]">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    min={nowLocal}
                    max={deadlineLocalMax}
                    value={formData.preferredDateTime}
                    onChange={(e) => setFormData({ ...formData, preferredDateTime: e.target.value })}
                    className={cn(
                      "h-12 rounded-xl border-[var(--header-floating-border)] bg-background px-4 text-[15px] shadow-sm focus-visible:ring-[var(--primary-color)]",
                      errors.preferredDateTime &&
                        "border-[var(--error-color)] focus-visible:ring-[var(--error-color)]"
                    )}
                  />
                  {errors.preferredDateTime && (
                    <span className="text-xs font-medium text-[var(--error-color)]">{errors.preferredDateTime}</span>
                  )}
                </div>

                <div className="mt-2 flex items-start gap-4 rounded-2xl border border-[var(--header-floating-border)] bg-background p-5 shadow-sm">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: !!checked })}
                    className={cn(
                      "mt-0.5 h-5 w-5 shrink-0 rounded-md data-[state=checked]:border-[var(--primary-color)] data-[state=checked]:bg-[var(--primary-color)]",
                      errors.consent && "border-[var(--error-color)]"
                    )}
                  />
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="consent" className="cursor-pointer text-[14px] font-medium leading-relaxed text-[var(--text-primary)]">
                      I consent to participate in this interview and understand that my information will be used for recruitment purposes only.
                    </Label>
                    {errors.consent && (
                      <span className="text-xs font-medium text-[var(--error-color)]">{errors.consent}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row mt-4">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="h-14 w-full rounded-xl text-[16px] font-bold text-white shadow-md transition-all duration-200 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] hover:shadow-[0_8px_20px_rgba(var(--primary-color-rgb),0.25)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitMutation.isPending ? "Saving…" : "Register for Interview"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}