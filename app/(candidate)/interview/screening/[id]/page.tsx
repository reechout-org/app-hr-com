"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  ChevronRight,
  FileText,
  Building2,
  Briefcase,
  Loader2
} from "lucide-react";
import { parseApiError } from "@/lib/api/client";
import { interviewsApi } from "@/lib/api/interviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/ui/cn";

const basicInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  countryCode: z.string(),
  phoneNumber: z.string().regex(/^\d{7,14}$/, "Phone number must be 7-14 digits"),
});

type BasicInfoValues = z.infer<typeof basicInfoSchema>;

interface ScreeningQuestion {
  id: string;
  question_text: string;
  order: number;
}

interface InterviewDetails {
  id: string;
  questionnaire_title: string;
  company_name: string;
  type: string;
}

const COUNTRY_CODES = [
  { label: "🇺🇸 USA (+1)", value: "usa", code: "+1" },
  { label: "🇨🇦 Canada (+1)", value: "canada", code: "+1" },
  { label: "🇬🇧 UK (+44)", value: "uk", code: "+44" },
  { label: "🇦🇺 Australia (+61)", value: "australia", code: "+61" },
];

export default function ScreeningPage() {
  const { id: interviewId } = useParams() as { id: string };
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<
    "loading" | "basic-info" | "questions" | "evaluating" | "submitted" | "rejected" | "redirecting"
  >("loading");
  
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const basicInfoForm = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      countryCode: "usa",
    },
  });

  const screeningForm = useForm<Record<string, string>>();

  useEffect(() => {
    if (interviewId) {
      loadScreeningQuestions();
    }
  }, [interviewId]);

  const loadScreeningQuestions = async () => {
    try {
      const response = await interviewsApi.getScreeningQuestions(interviewId);
      const data = response.data || response;
      setInterviewDetails(data.interview);
      const questions = data.screening_questions || [];
      setScreeningQuestions(questions);

      if (!data.has_screening_questions || questions.length === 0) {
        router.push(`/interview/share/${interviewId}`);
        return;
      }

      setCurrentStep("basic-info");
    } catch (error: unknown) {
      console.error("Error loading screening questions:", error);
      const status =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 404) {
        toast.error("Interview not found");
        setCurrentStep("rejected");
      } else {
        toast.error(
          "Failed to load application questions. Redirecting…"
        );
        router.push(`/interview/share/${interviewId}`);
      }
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setResumeFile(file);
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const onBasicInfoSubmit = () => {
    if (!resumeFile) {
      toast.warning("Please upload your resume (PDF) to continue");
      return;
    }
    setCurrentStep("questions");
  };

  const onScreeningSubmit = async (data: Record<string, string>) => {
    setCurrentStep("evaluating");
    
    try {
      const basicInfo = basicInfoForm.getValues();
      const formData = new FormData();
      formData.append("interview_id", interviewId);
      formData.append("first_name", basicInfo.firstName);
      formData.append("last_name", basicInfo.lastName);
      formData.append("email", basicInfo.email);
      
      const countryCode = COUNTRY_CODES.find(c => c.value === basicInfo.countryCode)?.code || "+1";
      formData.append("phone", `${countryCode}${basicInfo.phoneNumber}`);
      
      if (resumeFile) formData.append("resume", resumeFile);
      
      const answers: Record<string, string> = {};
      screeningQuestions.forEach(q => {
        answers[q.id] = data[`question_${q.id}`];
      });
      formData.append("answers", JSON.stringify(answers));

      const response = await interviewsApi.evaluateScreeningAnswersWithFile(formData);
      const result = response.data || response;
      setEvaluationResult(result);

      if (result.status === "processing" || result.message?.includes("processing")) {
        setCurrentStep("submitted");
        toast.success(
          "Your answers have been submitted successfully! Please check your email for the results."
        );
      } else if (result.passed) {
        setCurrentStep("redirecting");
        toast.success("Congratulations! Your application has been approved.");
        setTimeout(() => {
          router.push(`/interview/share/${interviewId}/candidate/${result.candidate_id}`);
        }, 2000);
      } else {
        setCurrentStep("rejected");
      }
    } catch (error: unknown) {
      console.error("Error evaluating answers:", error);
      setCurrentStep("questions");
      toast.error(parseApiError(error));
    }
  };

  const progress = currentStep === "basic-info" ? 33 : currentStep === "questions" ? 66 : 100;

  if (currentStep === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--primary-color)]" />
      </div>
    );
  }

  if (currentStep === "evaluating" || currentStep === "redirecting") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary-color)]/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-[var(--primary-color)]/20" />
          <Loader2 className="h-10 w-10 animate-spin text-[var(--primary-color)] relative z-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {currentStep === "redirecting" ? "Preparing Interview..." : "Analyzing Application"}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto leading-relaxed">
            {currentStep === "redirecting" 
              ? "We're setting up your interview environment." 
              : "Our AI is securely processing your responses and resume. Please do not close this window."}
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === "submitted") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_8px_32px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--success-color)]/10 ring-8 ring-[var(--success-color)]/5">
            <CheckCircle2 className="h-12 w-12 text-[var(--success-color)]" />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Application Submitted</h2>
          <p className="mb-10 text-[var(--text-secondary)] text-[15px] leading-relaxed max-w-md mx-auto">
            Your application has been successfully securely submitted and is currently under review.
          </p>
          <div className="rounded-2xl border border-[var(--header-floating-border)] bg-[var(--surface-2)] p-6 text-left">
            <h4 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[var(--primary-color)]" />
              Next Steps
            </h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-1.5 shrink-0" />
                <span>Our team will review your answers and resume.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-1.5 shrink-0" />
                <span>You will receive an email with the evaluation results.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-1.5 shrink-0" />
                <span>If approved, you'll instantly get a link to begin your interview.</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 px-4 py-3 text-sm font-medium text-[var(--primary-color)]">
              <Mail className="h-4 w-4 shrink-0" />
              Keep an eye on your inbox (and spam folder).
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "rejected") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--error-color)]/20 bg-[var(--header-floating-bg)] shadow-[0_8px_32px_rgba(var(--error-color-rgb),0.05)] backdrop-blur-xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--error-color)]/10 ring-8 ring-[var(--error-color)]/5">
            <AlertCircle className="h-12 w-12 text-[var(--error-color)]" />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Status Update</h2>
          <p className="mb-8 text-[var(--text-secondary)] text-[15px] leading-relaxed max-w-md mx-auto">
            {evaluationResult?.evaluation_summary || "Thank you for applying. Unfortunately, your application did not meet the minimum requirements for this position at this time."}
          </p>
          {evaluationResult?.disqualifying_factors?.length > 0 && (
            <div className="rounded-2xl border border-[var(--error-color)]/20 bg-[var(--error-color)]/5 p-6 text-left">
              <h4 className="font-bold text-[var(--error-color)] mb-4 text-sm uppercase tracking-wide">Key Factors</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {evaluationResult.disqualifying_factors.map((factor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--error-color)] mt-0.5 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[var(--primary-color)]/5 to-transparent pointer-events-none" />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10 flex flex-col">
        
        {/* Header Block */}
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Application Screening
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[var(--text-secondary)] text-sm sm:text-base">
            <span className="flex items-center gap-1.5 font-medium bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--header-floating-border)]">
              <Briefcase className="h-4 w-4 text-[var(--primary-color)]" />
              {interviewDetails?.questionnaire_title}
            </span>
            {interviewDetails?.company_name && (
              <span className="flex items-center gap-1.5 font-medium bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--header-floating-border)]">
                <Building2 className="h-4 w-4 text-[var(--primary-color)]" />
                {interviewDetails.company_name}
              </span>
            )}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between text-xs sm:text-sm font-semibold px-1">
            <span className={cn("transition-colors", currentStep === "basic-info" ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)]")}>Basic Information</span>
            <span className={cn("transition-colors", currentStep === "questions" ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)]")}>Screening Questions</span>
            <span className="text-[var(--text-secondary)]">Submission</span>
          </div>
          <div className="h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--header-floating-border)]">
            <div 
              className="h-full bg-[var(--primary-color)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl">
          
          {currentStep === "basic-info" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-6 sm:px-8 border-b border-[var(--header-floating-border)] bg-transparent">
                <div className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-widest mb-1">Step 1 of 2</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Your Information</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Please provide your contact details and resume to begin.</p>
              </div>
              
              <div className="p-6 sm:p-8">
                <form onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-[var(--text-primary)]">First Name <span className="text-[var(--error-color)]">*</span></Label>
                      <Input id="firstName" {...basicInfoForm.register("firstName")} placeholder="e.g. Emily" className="h-11 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" />
                      {basicInfoForm.formState.errors.firstName && (
                        <p className="text-xs text-[var(--error-color)] font-medium">{basicInfoForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-[var(--text-primary)]">Last Name <span className="text-[var(--error-color)]">*</span></Label>
                      <Input id="lastName" {...basicInfoForm.register("lastName")} placeholder="e.g. Chen" className="h-11 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" />
                      {basicInfoForm.formState.errors.lastName && (
                        <p className="text-xs text-[var(--error-color)] font-medium">{basicInfoForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">Email Address <span className="text-[var(--error-color)]">*</span></Label>
                    <Input id="email" type="email" {...basicInfoForm.register("email")} placeholder="emily@example.com" className="h-11 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" />
                    {basicInfoForm.formState.errors.email && (
                      <p className="text-xs text-[var(--error-color)] font-medium">{basicInfoForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-[var(--text-primary)]">Phone Number <span className="text-[var(--error-color)]">*</span></Label>
                    <div className="flex gap-3">
                      <div className="w-[120px] sm:w-[140px] shrink-0">
                        <Controller
                          control={basicInfoForm.control}
                          name="countryCode"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="h-11 rounded-xl bg-background border-[var(--header-floating-border)] focus:ring-[var(--primary-color)]">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRY_CODES.map((c) => (
                                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <Input 
                        id="phone" 
                        className="flex-1 h-11 rounded-xl bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)]" 
                        {...basicInfoForm.register("phoneNumber")} 
                        placeholder="555 123 4567" 
                      />
                    </div>
                    {basicInfoForm.formState.errors.phoneNumber && (
                      <p className="text-xs text-[var(--error-color)] font-medium">{basicInfoForm.formState.errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="resume" className="text-sm font-medium text-[var(--text-primary)] flex items-center justify-between">
                      <span>Resume (PDF) <span className="text-[var(--error-color)]">*</span></span>
                    </Label>
                    <label 
                      htmlFor="resume"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 group",
                        resumeFile 
                          ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5" 
                          : "border-[var(--header-floating-border)] bg-[var(--surface-2)] hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/5"
                      )}
                    >
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleResumeChange}
                      />
                      {resumeFile ? (
                        <div className="flex flex-col items-center text-center px-4">
                          <div className="w-12 h-12 mb-3 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[var(--primary-color)]" />
                          </div>
                          <p className="font-semibold text-[var(--primary-color)] truncate max-w-xs">{resumeFile.name}</p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center px-4">
                          <div className="w-12 h-12 mb-3 rounded-full bg-background border border-[var(--header-floating-border)] flex items-center justify-center group-hover:bg-background group-hover:border-[var(--primary-color)]/30 transition-all shadow-sm">
                            <Upload className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors" />
                          </div>
                          <p className="font-medium text-[var(--text-primary)] mb-1">Click to upload your resume</p>
                          <p className="text-xs text-[var(--text-secondary)]">PDF files only (Max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl text-base font-bold shadow-md bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] hover:shadow-[0_8px_20px_rgba(var(--primary-color-rgb),0.25)] hover:-translate-y-0.5 active:translate-y-0 text-white transition-all duration-200" 
                      disabled={!resumeFile}
                    >
                      Continue to Questions <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentStep === "questions" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="px-6 py-6 sm:px-8 border-b border-[var(--header-floating-border)] bg-transparent">
                <div className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-widest mb-1">Step 2 of 2</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Application Questions</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Please answer the following questions to complete your application.</p>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={screeningForm.handleSubmit(onScreeningSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    {screeningQuestions.map((q, i) => (
                      <div key={q.id} className="space-y-4 p-5 sm:p-6 rounded-2xl border border-[var(--header-floating-border)] bg-[var(--surface-2)] transition-colors hover:border-[rgba(var(--primary-color-rgb),0.2)]">
                        <Label htmlFor={`question_${q.id}`} className="text-base font-semibold leading-relaxed text-[var(--text-primary)] flex items-start gap-2">
                          <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-md bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <span className="mt-0.5">{q.question_text}</span>
                        </Label>
                        <Textarea
                          id={`question_${q.id}`}
                          {...screeningForm.register(`question_${q.id}`, { required: true })}
                          placeholder="Type your answer here..."
                          rows={5}
                          className="bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] rounded-xl resize-y min-h-[120px] text-[15px] p-4 shadow-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-[var(--header-floating-border)]">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-12 flex-1 rounded-xl border-[var(--header-floating-border)] bg-background text-[var(--text-primary)] hover:bg-[var(--surface-2)] shadow-sm font-medium"
                      onClick={() => setCurrentStep("basic-info")}
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="h-12 flex-[2] rounded-xl text-base font-bold shadow-md bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] hover:shadow-[0_8px_20px_rgba(var(--primary-color-rgb),0.25)] hover:-translate-y-0.5 active:translate-y-0 text-white transition-all duration-200"
                      disabled={!screeningForm.formState.isValid}
                    >
                      Submit Application <CheckCircle2 className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
