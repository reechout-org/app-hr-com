"use client";

import { Check, CheckCircle, ChevronLeft, ChevronRight, FileText, Gauge, LayoutDashboard, Star, Trophy, Users } from "lucide-react";
import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";

interface CreateQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const STEPS = [
  { id: 0, title: "Role Info", icon: FileText },
  { id: 1, title: "Work Demands", icon: LayoutDashboard },
  { id: 2, title: "Competencies", icon: Trophy },
  { id: 3, title: "Culture & Values", icon: Users },
  { id: 4, title: "Success & Failure", icon: Star },
  { id: 5, title: "Review", icon: Gauge },
];

export function CreateQuestionnaireModal({ isOpen, onClose, onSubmit, isSubmitting }: CreateQuestionnaireModalProps) {
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
      <DialogContent className="max-w-[1000px] w-[95vw] p-0 overflow-hidden border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] max-h-[90vh] flex flex-col backdrop-blur-xl">
        <DialogHeader className="shrink-0 border-b border-[var(--header-floating-border)] bg-transparent px-6 py-5 sm:px-8 text-left">
          <DialogTitle className="text-xl font-bold text-foreground">
            Create Questionnaire
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--text-secondary)] mt-1">
            Configure the requirements and context to generate the perfect interview questions.
          </DialogDescription>
        </DialogHeader>
        
        {/* Body Container */}
        <div className="flex flex-1 min-h-0 w-full flex-col bg-transparent md:flex-row overflow-hidden">
          
          {/* Sidebar */}
          <div className="flex w-full flex-none flex-col overflow-y-auto bg-transparent p-4 sm:p-6 md:w-[260px] border-b md:border-b-0 md:border-r border-[var(--header-floating-border)]">
            <h4 className="mb-4 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Configuration Steps
            </h4>
            <div className="flex flex-row gap-1.5 overflow-x-auto pb-2 md:flex-col md:pb-0 scrollbar-none">
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
                      "group relative flex items-center gap-3 whitespace-nowrap rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm transition-all md:whitespace-normal",
                      isActive
                        ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-foreground disabled:opacity-40",
                      completed && !isActive && "text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-[var(--primary-color)]" : completed ? "text-[var(--success-color)]" : "text-[var(--text-secondary)] group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1 transition-colors">
                      {step.title}
                    </span>
                    {completed && !isActive && (
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[var(--success-color)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0 overflow-y-auto bg-transparent p-5 sm:p-8 md:p-10">
            <div className="mx-auto max-w-2xl">
              {/* Step 0: Role Info */}
              {currentStep === 0 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Role Information</h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Provide the foundational details for the position you are hiring for.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-foreground">Role Name <span className="text-[var(--error-color)]">*</span></Label>
                      <Input type="text" value={roleInfo.roleName} onChange={e => setRoleInfo({...roleInfo, roleName: e.target.value})} placeholder="e.g., Senior Full Stack Engineer" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Company Name</Label>
                      <Input type="text" value={roleInfo.companyName} onChange={e => setRoleInfo({...roleInfo, companyName: e.target.value})} placeholder="e.g., Acme Corp" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Department</Label>
                      <Input type="text" value={roleInfo.department} onChange={e => setRoleInfo({...roleInfo, department: e.target.value})} placeholder="e.g., Engineering" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Seniority Level</Label>
                      <Select value={roleInfo.seniorityLevel} onValueChange={val => setRoleInfo({...roleInfo, seniorityLevel: val})}>
                        <SelectTrigger className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus:ring-[var(--primary-color)] shadow-sm">
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
                      <Label className="text-sm font-medium text-foreground">Location</Label>
                      <Input type="text" value={roleInfo.location} onChange={e => setRoleInfo({...roleInfo, location: e.target.value})} placeholder="e.g., Remote, New York" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Min. Salary</Label>
                      <Input type="number" step="1000" min="0" value={roleInfo.minSalary} onChange={e => setRoleInfo({...roleInfo, minSalary: e.target.value})} placeholder="e.g., 50000" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Max. Salary</Label>
                      <Input type="number" step="1000" min="0" value={roleInfo.maxSalary} onChange={e => setRoleInfo({...roleInfo, maxSalary: e.target.value})} placeholder="e.g., 80000" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Years of Experience</Label>
                      <Input type="number" value={roleInfo.yearsOfExperience} onChange={e => setRoleInfo({...roleInfo, yearsOfExperience: e.target.value})} placeholder="e.g., 3" className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">Number of Questions <span className="text-xs font-normal text-[var(--text-secondary)] ml-1">(2-15)</span></Label>
                      <Input type="number" min={2} max={15} value={roleInfo.numberOfQuestions} onChange={e => setRoleInfo({...roleInfo, numberOfQuestions: Number(e.target.value)})} className="h-10 rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <Label className="text-sm font-medium text-foreground">Job Description <span className="text-[var(--error-color)]">*</span></Label>
                    <Textarea
                      value={roleInfo.jobDescription}
                      onChange={e => setRoleInfo({ ...roleInfo, jobDescription: e.target.value })}
                      rows={12}
                      placeholder="Paste the job description here. Include responsibilities, required skills, and technical stack..."
                      className="min-h-52 resize-none rounded-[var(--radius-md)] border-[var(--header-floating-border)] bg-background text-sm shadow-sm focus-visible:ring-[var(--primary-color)] sm:min-h-60"
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Work Demands */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Work Demands</h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Adjust the sliders to define the day-to-day context and pressures of this role.</p>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                    {Object.entries({
                      stressLevel: { title: "Stress Level", desc: "How stressful is this role on average?" },
                      customerContact: { title: "Customer Contact", desc: "How much direct customer interaction is required?" },
                      teamworkVsSolo: { title: "Teamwork vs Solo Work", desc: "How much teamwork versus individual work is expected?" },
                      ambiguityChange: { title: "Ambiguity & Change", desc: "How often do tools, processes, or priorities change?" },
                    }).map(([key, info]) => (
                      <div key={key} className="flex flex-col gap-5">
                        <div className="flex items-end justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{info.title}</h4>
                            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{info.desc}</p>
                          </div>
                          <span className="text-sm font-bold text-[var(--primary-color)]">
                            {formatSliderLabel((workDemands as any)[key], "demand")}
                          </span>
                        </div>
                        <div className="px-1">
                          <Slider
                            min={1} max={5} step={1}
                            value={[(workDemands as any)[key]]}
                            onValueChange={([val]) => setWorkDemands({...workDemands, [key]: val})}
                            className="py-1"
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-[var(--text-secondary)] px-1">
                          <span>Very Low</span>
                          <span>Very High</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Competencies */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Competency Ratings</h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Rate the importance of each core competency for this specific role.</p>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                    {Object.entries({
                      reliabilityOwnership: { title: "Reliability & Ownership", desc: "Taking responsibility for outcomes and consistently delivering." },
                      learningAdaptability: { title: "Learning & Adaptability", desc: "Quickly acquiring new skills and adjusting to changes." },
                      communicationClarity: { title: "Communication & Clarity", desc: "Expressing ideas clearly to diverse audiences." },
                      empathyCollaboration: { title: "Empathy & Collaboration", desc: "Working well with others and understanding their perspectives." },
                      resilienceStress: { title: "Resilience & Stress Tolerance", desc: "Maintaining performance under pressure or after setbacks." },
                      valuesCultureFit: { title: "Values & Culture Alignment", desc: "Aligning with the company's core mission and behavioral norms." },
                    }).map(([key, info]) => (
                      <div key={key} className="flex flex-col gap-5">
                        <div className="flex items-end justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{info.title}</h4>
                            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{info.desc}</p>
                          </div>
                          <span className="text-sm font-bold text-[var(--primary-color)]">
                            {formatSliderLabel((competencies as any)[key], "competency")}
                          </span>
                        </div>
                        <div className="px-1">
                          <Slider
                            min={0} max={3} step={1}
                            value={[(competencies as any)[key]]}
                            onValueChange={([val]) => setCompetencies({...competencies, [key]: val})}
                            className="py-1"
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-[var(--text-secondary)] px-1">
                          <span>Not Required</span>
                          <span>Critical</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Culture & Values */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Culture Profile</h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Define the working style and cultural expectations.</p>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                    {Object.entries({
                      paceOfWork: { title: "Pace of Work", left: "Steady & Predictable", right: "Fast & Urgent" },
                      feedbackStyle: { title: "Feedback Style", left: "Formal & Structured", right: "Direct & Continuous" },
                      decisionMaking: { title: "Decision Making", left: "Consensus Driven", right: "Top-down / Autocratic" },
                      collaboration: { title: "Collaboration", left: "Highly Independent", right: "Deeply Collaborative" },
                    }).map(([key, info]) => (
                      <div key={key} className="flex flex-col gap-5">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground text-center mb-1">{info.title}</h4>
                        </div>
                        <div className="px-1">
                          <Slider
                            min={0} max={3} step={1}
                            value={[(culture as any)[key]]}
                            onValueChange={([val]) => setCulture({...culture, [key]: val})}
                            className="py-1"
                          />
                        </div>
                        <div className="flex justify-between text-[12px] font-medium text-[var(--text-secondary)] px-1">
                          <span>{info.left}</span>
                          <span>{info.right}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Success & Failure */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Success & Failure Profiles</h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Describe the behaviors that lead to success or failure in this role.</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Label className="text-sm font-medium text-foreground">Success Patterns <span className="text-[var(--error-color)]">*</span></Label>
                    <Textarea value={performance.topPerformers} onChange={e => setPerformance({...performance, topPerformers: e.target.value})} rows={6} placeholder="Think of 3–5 top performers in this role. What do they do that weaker performers don't? Example: 'They always follow up with customers without being reminded.'" className="resize-none rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm text-sm" />
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <Label className="text-sm font-medium text-foreground">Failure Patterns <span className="text-[var(--error-color)]">*</span></Label>
                    <Textarea value={performance.commonFailureModes} onChange={e => setPerformance({...performance, commonFailureModes: e.target.value})} rows={6} placeholder="When people fail in this role, what usually goes wrong? Example: 'They ghost shifts without notice. They get flustered with angry customers.'" className="resize-none rounded-[var(--radius-md)] bg-background border-[var(--header-floating-border)] focus-visible:ring-[var(--primary-color)] shadow-sm text-sm" />
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Review & Finalize</h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Ensure all constraints are accurate before generating your questionnaire.</p>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div className="rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-background p-5 sm:p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary-color)]/50"></div>
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-semibold text-foreground"><FileText className="h-4 w-4 text-[var(--primary-color)]" /> Role Information</h4>
                        <button onClick={() => setCurrentStep(0)} className="text-xs font-semibold text-[var(--primary-color)] hover:underline">Edit</button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <span className="text-[var(--text-secondary)]">Role Name:</span>
                        <span className="font-medium text-foreground text-right">{roleInfo.roleName || "Not provided"}</span>
                        <span className="text-[var(--text-secondary)]">Department:</span>
                        <span className="font-medium text-foreground text-right">{roleInfo.department || "Not provided"}</span>
                        <span className="text-[var(--text-secondary)]">Experience:</span>
                        <span className="font-medium text-foreground text-right">{roleInfo.yearsOfExperience ? `${roleInfo.yearsOfExperience} years` : "Not provided"}</span>
                        <span className="text-[var(--text-secondary)]">Questions:</span>
                        <span className="font-medium text-foreground text-right">{roleInfo.numberOfQuestions}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-background p-5 sm:p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-semibold text-foreground"><Star className="h-4 w-4 text-emerald-500" /> Performance Profiles</h4>
                        <button onClick={() => setCurrentStep(4)} className="text-xs font-semibold text-emerald-600 hover:underline">Edit</button>
                      </div>
                      <div className="flex flex-col gap-5 text-sm">
                        <div>
                          <span className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-semibold block mb-2">Success Patterns</span>
                          <p className="text-foreground leading-relaxed bg-[var(--surface-2)] border border-[var(--header-floating-border)] p-3 rounded-[var(--radius-md)]">{performance.topPerformers || "Not provided"}</p>
                        </div>
                        <div>
                          <span className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-semibold block mb-2">Failure Patterns</span>
                          <p className="text-foreground leading-relaxed bg-[var(--surface-2)] border border-[var(--header-floating-border)] p-3 rounded-[var(--radius-md)]">{performance.commonFailureModes || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex shrink-0 items-center justify-between border-t border-[var(--header-floating-border)] bg-transparent sm:justify-between">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="h-10 rounded-[var(--radius-md)] px-4 text-sm font-medium border-[var(--header-floating-border)] bg-background hover:bg-[var(--surface-2)]"
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
              className="h-10 rounded-[var(--radius-md)] px-4 text-sm font-medium hover:text-destructive hover:bg-destructive/10"
            >
              Cancel
            </Button>
            {currentStep < 5 ? (
              <Button
                type="button"
                disabled={!isStepValid(currentStep)}
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="h-10 rounded-[var(--radius-md)] px-5 text-sm font-semibold shadow-md bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white transition-all disabled:opacity-50"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => onSubmit({ roleInfo, workDemands, competencies, culture, performance })}
                className="h-10 rounded-[var(--radius-md)] px-6 text-sm font-semibold bg-[var(--success-color)] hover:opacity-90 text-white shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Check className="mr-2 h-4 w-4" strokeWidth={3} />
                {isSubmitting ? "Creating…" : "Generate Questionnaire"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
