"use client";

import { Check, CheckCircle, ChevronLeft, ChevronRight, FileText, Gauge, LayoutDashboard, Star, Trophy, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/ui/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



interface CreateQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const STEPS = [
  { id: 0, title: "Role Info", icon: FileText },
  { id: 1, title: "Work Demands", icon: LayoutDashboard },
  { id: 2, title: "Competencies", icon: Trophy },
  { id: 3, title: "Culture & Values", icon: Users },
  { id: 4, title: "Success & Failure", icon: Star },
  { id: 5, title: "Review", icon: Gauge },
];

export function CreateQuestionnaireModal({ isOpen, onClose, onSubmit }: CreateQuestionnaireModalProps) {
    const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [roleInfo, setRoleInfo] = useState({
    roleName: "",
    companyName: "",
    department: "",
    seniorityLevel: "",
    location: "",
    yearsOfExperience: "",
    minSalary: "",
    maxSalary: "",
    numberOfQuestions: 5,
    jobDescription: "",
  });

  const [workDemands, setWorkDemands] = useState({
    stressLevel: 3,
    customerContact: 3,
    teamworkVsSolo: 3,
    ambiguityChange: 3,
  });

  const [competencies, setCompetencies] = useState({
    reliabilityOwnership: 2,
    learningAdaptability: 2,
    communicationClarity: 2,
    empathyCollaboration: 2,
    resilienceStress: 2,
    valuesCultureFit: 2,
  });

  const [culture, setCulture] = useState({
    paceOfWork: 2,
    feedbackStyle: 2,
    decisionMaking: 2,
    collaboration: 2,
  });

  const [performance, setPerformance] = useState({
    topPerformers: "",
    commonFailureModes: "",
  });


  const isStepValid = (step: number) => {
    if (step === 0) return roleInfo.roleName.length > 2 && roleInfo.jobDescription.length > 9;
    if (step === 4) return performance.topPerformers.length > 9 && performance.commonFailureModes.length > 9;
    return true; // Sliders are always valid
  };

  const formatSliderLabel = (val: number, type: string) => {
    if (type === "demand") {
      return ["Very Low", "Low", "Moderate", "High", "Very High"][val - 1] || "Moderate";
    }
    if (type === "competency") {
      return ["Not Required", "Nice to Have", "Important", "Critical"][val] || "Important";
    }
    return val.toString();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentStep(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[1200px] w-[95vw] p-0 overflow-hidden border-border bg-background shadow-lg sm:rounded-[20px] max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0 border-b border-border bg-card px-6 py-4 text-left">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Create Questionnaire
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new questionnaire by filling out the details.
          </DialogDescription>
        </DialogHeader>
            {/* Body Container */}
        <div className="flex flex-1 min-h-0 w-full flex-col bg-[var(--gray-bg)] md:flex-row overflow-hidden">
          
          {/* Sidebar */}
          <div className="flex w-full flex-none flex-col overflow-y-auto border-b border-[var(--glass-border-light)] bg-[var(--glass-bg-light)] p-6 backdrop-blur-xl md:w-[280px] md:border-b-0 md:border-r" data-lenis-prevent>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Steps
            </h4>
            <div className="flex flex-row gap-2 overflow-x-auto pb-2 md:flex-col md:pb-0">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const completed = isStepValid(step.id) && currentStep !== step.id;
                const disabled = step.id > 0 && !isStepValid(step.id - 1) && step.id > currentStep;

                return (
                  <button
                    key={step.id}
                    disabled={disabled}
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "group relative flex items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left text-sm transition-all md:whitespace-normal",
                      isActive
                        ? "border-[var(--primary-color)]/60 bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--primary-color)]/5 shadow-sm ring-1 ring-inset ring-[var(--primary-color)]/20"
                        : "border-[var(--glass-border-medium)] bg-white/40 shadow-sm hover:border-[var(--glass-border-dark)] hover:bg-white/60 hover:shadow-md disabled:opacity-50 dark:bg-black/20 dark:hover:bg-black/40",
                      completed && !isActive && "border-[var(--success-color)]/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-[var(--primary-color)]" : completed ? "text-[var(--success-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--primary-color)]"
                      )}
                    />
                    <span
                      className={cn(
                        "flex-1 font-medium transition-colors",
                        isActive ? "font-bold text-[var(--primary-color)]" : "text-[var(--text-primary)] group-hover:text-[var(--primary-color)]"
                      )}
                    >
                      {step.title}
                    </span>
                    {completed && !isActive && (
                      <CheckCircle className="h-4 w-4 shrink-0 text-[var(--success-color)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0 overflow-y-auto bg-[var(--surface-1)] p-6 md:p-10" data-lenis-prevent>
            {/* Step 0: Role Info */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-[var(--glass-border-light)] pb-5">
                  <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Role Information</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Provide the basic details for the position you are hiring for.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Role Name <span className="text-[var(--error-color)]">*</span></Label>
                    <Input type="text" value={roleInfo.roleName} onChange={e => setRoleInfo({...roleInfo, roleName: e.target.value})} placeholder="e.g., Customer Support Representative" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Company Name</Label>
                    <Input type="text" value={roleInfo.companyName} onChange={e => setRoleInfo({...roleInfo, companyName: e.target.value})} placeholder="e.g., Acme Corp" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Department</Label>
                    <Input type="text" value={roleInfo.department} onChange={e => setRoleInfo({...roleInfo, department: e.target.value})} placeholder="e.g., Engineering, Sales" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Seniority Level</Label>
                    <Select value={roleInfo.seniorityLevel} onValueChange={val => setRoleInfo({...roleInfo, seniorityLevel: val})}>
                      <SelectTrigger className="h-10 rounded-xl bg-background border-border focus:ring-primary shadow-sm">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Location</Label>
                    <Input type="text" value={roleInfo.location} onChange={e => setRoleInfo({...roleInfo, location: e.target.value})} placeholder="e.g., Remote, New York" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Years of Experience</Label>
                    <Input type="number" value={roleInfo.yearsOfExperience} onChange={e => setRoleInfo({...roleInfo, yearsOfExperience: e.target.value})} placeholder="e.g., 3.5" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Minimum Salary (Annual)</Label>
                    <Input type="number" step="1000" min="0" value={roleInfo.minSalary} onChange={e => setRoleInfo({...roleInfo, minSalary: e.target.value})} placeholder="e.g., 50000" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Maximum Salary (Annual)</Label>
                    <Input type="number" step="1000" min="0" value={roleInfo.maxSalary} onChange={e => setRoleInfo({...roleInfo, maxSalary: e.target.value})} placeholder="e.g., 80000" className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-[var(--text-primary)]">Number of Questions <span className="text-xs font-normal text-[var(--text-muted)]">(Min 2, Max 15)</span></Label>
                    <Input type="number" min={2} max={15} value={roleInfo.numberOfQuestions} onChange={e => setRoleInfo({...roleInfo, numberOfQuestions: Number(e.target.value)})} className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <Label className="text-sm font-semibold text-[var(--text-primary)]">Job Description <span className="text-[var(--error-color)]">*</span></Label>
                  <Textarea value={roleInfo.jobDescription} onChange={e => setRoleInfo({...roleInfo, jobDescription: e.target.value})} rows={5} placeholder="Describe the role, responsibilities, required skills, and technical stack..." className="rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                </div>
              </div>
            )}

            {/* Step 1: Work Demands */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-[var(--glass-border-light)] pb-5">
                  <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Work Demands</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Adjust the sliders to define the day-to-day context and pressures of this role.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {Object.entries({
                    stressLevel: { title: "Stress Level", desc: "How stressful is this role on average?" },
                    customerContact: { title: "Customer Contact", desc: "How much direct customer interaction is required?" },
                    teamworkVsSolo: { title: "Teamwork vs Solo Work", desc: "How much teamwork versus individual work is expected?" },
                    ambiguityChange: { title: "Ambiguity & Change", desc: "How often do tools, processes, or priorities change?" },
                  }).map(([key, info]) => (
                    <div key={key} className="flex flex-col gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-near-white)] p-4 shadow-sm transition-all hover:border-[var(--border-color-light)] hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)]">{info.title}</h4>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{info.desc}</p>
                        </div>
                        <span className="rounded-lg bg-[var(--primary-color)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                          {formatSliderLabel((workDemands as any)[key], "demand")}
                        </span>
                      </div>
                      <Input 
                        type="range" min="1" max="5" step="1" 
                        value={(workDemands as any)[key]} 
                        onChange={(e) => setWorkDemands({...workDemands, [key]: parseInt(e.target.value)})}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--border-color-light)] accent-[var(--primary-color)]"
                      />
                      <div className="flex justify-between text-[10px] font-medium text-[var(--text-muted)]">
                        <span>Very Low</span><span>Low</span><span>Moderate</span><span>High</span><span>Very High</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Competencies */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-[var(--glass-border-light)] pb-5">
                  <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Competency Ratings</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Rate the importance of each core competency for this specific role.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {Object.entries({
                    reliabilityOwnership: { title: "Reliability & Ownership", desc: "Taking responsibility for outcomes and consistently delivering." },
                    learningAdaptability: { title: "Learning & Adaptability", desc: "Quickly acquiring new skills and adjusting to changes." },
                    communicationClarity: { title: "Communication & Clarity", desc: "Expressing ideas clearly to diverse audiences." },
                    empathyCollaboration: { title: "Empathy & Collaboration", desc: "Working well with others and understanding their perspectives." },
                    resilienceStress: { title: "Resilience & Stress Tolerance", desc: "Maintaining performance under pressure or after setbacks." },
                    valuesCultureFit: { title: "Values & Culture Alignment", desc: "Aligning with the company's core mission and behavioral norms." },
                  }).map(([key, info]) => (
                    <div key={key} className="flex flex-col gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-near-white)] p-4 shadow-sm transition-all hover:border-[var(--border-color-light)] hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)]">{info.title}</h4>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{info.desc}</p>
                        </div>
                        <span className="rounded-lg bg-[var(--primary-color)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                          {formatSliderLabel((competencies as any)[key], "competency")}
                        </span>
                      </div>
                      <Input 
                        type="range" min="0" max="3" step="1" 
                        value={(competencies as any)[key]} 
                        onChange={(e) => setCompetencies({...competencies, [key]: parseInt(e.target.value)})}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--border-color-light)] accent-[var(--primary-color)]"
                      />
                      <div className="flex justify-between text-[10px] font-medium text-[var(--text-muted)]">
                        <span>Not Required</span><span>Nice to Have</span><span>Important</span><span>Critical</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Culture & Values (Simplified placeholder for step 3) */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-[var(--glass-border-light)] pb-5">
                  <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Culture Profile</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Define the working style and cultural expectations.</p>
                </div>
                <div className="flex flex-col gap-4">
                  {Object.entries({
                    paceOfWork: { title: "Pace of Work", desc: "Steady and predictable vs. Fast and urgent" },
                    feedbackStyle: { title: "Feedback Style", desc: "Formal and structured vs. Direct and continuous" },
                    decisionMaking: { title: "Decision Making", desc: "Consensus driven vs. Top-down / Autocratic" },
                    collaboration: { title: "Collaboration", desc: "Highly independent vs. Deeply collaborative" },
                  }).map(([key, info]) => (
                    <div key={key} className="flex flex-col gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-near-white)] p-4 shadow-sm transition-all hover:border-[var(--border-color-light)] hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)]">{info.title}</h4>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{info.desc}</p>
                        </div>
                      </div>
                      <Input 
                        type="range" min="0" max="3" step="1" 
                        value={(culture as any)[key]} 
                        onChange={(e) => setCulture({...culture, [key]: parseInt(e.target.value)})}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--border-color-light)] accent-[var(--primary-color)]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Success & Failure */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-[var(--glass-border-light)] pb-5">
                  <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Success & Failure Profiles</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Describe the behaviors that lead to success or failure in this role.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold text-[var(--text-primary)]">Success Patterns <span className="text-[var(--error-color)]">*</span></Label>
                  <Textarea value={performance.topPerformers} onChange={e => setPerformance({...performance, topPerformers: e.target.value})} rows={6} placeholder="Think of 3–5 top performers in this role. What do they do that weaker performers don't? Example: 'They always follow up with customers without being reminded.'" className="rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold text-[var(--text-primary)]">Failure Patterns <span className="text-[var(--error-color)]">*</span></Label>
                  <Textarea value={performance.commonFailureModes} onChange={e => setPerformance({...performance, commonFailureModes: e.target.value})} rows={6} placeholder="When people fail in this role, what usually goes wrong? Example: 'They ghost shifts without notice. They get flustered with angry customers.'" className="rounded-xl bg-background border-border focus-visible:ring-primary shadow-sm" />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-[var(--glass-border-light)] pb-5">
                  <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Review & Finalize</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Review your questionnaire configuration before creating it.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-near-white)] p-5">
                    <div className="mb-3 flex items-center justify-between border-b border-[var(--border-color-light)] pb-3">
                      <h4 className="flex items-center gap-2 font-semibold text-[var(--text-primary)]"><FileText className="h-4 w-4 text-[var(--primary-color)]" /> Role Information</h4>
                      <button onClick={() => setCurrentStep(0)} className="text-xs font-semibold text-[var(--primary-color)] hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="font-medium text-[var(--text-secondary)]">Role Name:</span>
                      <span className="font-semibold text-[var(--text-primary)] text-right">{roleInfo.roleName || "-"}</span>
                      <span className="font-medium text-[var(--text-secondary)]">Department:</span>
                      <span className="font-semibold text-[var(--text-primary)] text-right">{roleInfo.department || "-"}</span>
                      <span className="font-medium text-[var(--text-secondary)]">Questions:</span>
                      <span className="font-semibold text-[var(--text-primary)] text-right">{roleInfo.numberOfQuestions}</span>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-near-white)] p-5">
                    <div className="mb-3 flex items-center justify-between border-b border-[var(--border-color-light)] pb-3">
                      <h4 className="flex items-center gap-2 font-semibold text-[var(--text-primary)]"><Star className="h-4 w-4 text-[var(--primary-color)]" /> Performance Profiles</h4>
                      <button onClick={() => setCurrentStep(4)} className="text-xs font-semibold text-[var(--primary-color)] hover:underline">Edit</button>
                    </div>
                    <div className="flex flex-col gap-4 text-sm">
                      <div>
                        <span className="font-medium text-[var(--text-secondary)] block mb-1">Success Patterns:</span>
                        <p className="rounded-lg border border-[var(--border-color-light)] bg-[var(--background-color)] p-3 text-[var(--text-primary)]">{performance.topPerformers || "-"}</p>
                      </div>
                      <div>
                        <span className="font-medium text-[var(--text-secondary)] block mb-1">Failure Patterns:</span>
                        <p className="rounded-lg border border-[var(--border-color-light)] bg-[var(--background-color)] p-3 text-[var(--text-primary)]">{performance.commonFailureModes || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex shrink-0 items-center justify-between border-t border-border bg-card px-6 py-4 sm:justify-between">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="h-10 rounded-xl px-4 text-sm font-medium"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl px-4 text-sm font-medium hover:text-destructive hover:bg-destructive/10"
            >
              Cancel
            </Button>
            {currentStep < 5 ? (
              <Button
                type="button"
                disabled={!isStepValid(currentStep)}
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="h-10 rounded-xl px-5 text-sm font-semibold shadow-md"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onSubmit({ roleInfo, workDemands, competencies, culture, performance })}
                className="h-10 rounded-xl px-5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Check className="mr-2 h-4 w-4" strokeWidth={3} />
                Create Questionnaire
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
