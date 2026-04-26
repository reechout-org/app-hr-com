"use client";

import { X, User, FileText, Code, TrendingUp, CheckCircle, Book, MessageSquare, Heart, Zap, Star, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/ui/cn";
import { Persona } from "@/lib/api/questionnaires";

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  attributes?: string[];
  persona: Persona | null;
}

const NAV_ITEMS = [
  { id: "summary", label: "Executive Summary", icon: FileText, key: "persona_summary" },
  { id: "technical", label: "Technical Requirements", icon: Code, key: "technical_functional_requirements" },
  { id: "success", label: "Success Patterns", icon: TrendingUp, key: "success_patterns" },
  { id: "reliability", label: "Reliability & Ownership", icon: CheckCircle, key: "reliability_ownership" },
  { id: "learning", label: "Learning & Adaptability", icon: Book, key: "learning_adaptability" },
  { id: "communication", label: "Communication & Clarity", icon: MessageSquare, key: "communication_clarity" },
  { id: "empathy", label: "Empathy & Collaboration", icon: Heart, key: "empathy_collaboration" },
  { id: "resilience", label: "Resilience Under Stress", icon: Zap, key: "resilience_stress" },
  { id: "culture", label: "Values & Culture Fit", icon: Star, key: "values_culture_fit" },
  { id: "risks", label: "Risk Factors", icon: AlertTriangle, key: "risk_factors" },
] as const;

export function PersonaModal({ isOpen, onClose, title, attributes = [], persona }: PersonaModalProps) {
  const [activeSection, setActiveSection] = useState<string>("summary");

  // Keep track of which sections actually have content
  const activeNavItems = NAV_ITEMS.filter(item => persona && persona[item.key as keyof Persona]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    
    for (const item of activeNavItems) {
      const el = document.getElementById(`persona-${item.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (rect.top >= containerRect.top && rect.top <= containerRect.top + 200) {
          setActiveSection(item.id);
          break;
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`persona-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1200px] w-[95vw] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] max-h-[85vh] flex flex-col dark:border-white/[0.09]">
        <DialogHeader className="shrink-0 border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] px-6 py-4 text-left flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">Ideal Candidate Persona</DialogTitle>
              <DialogDescription className="text-sm mt-0.5 text-muted-foreground">{title}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 w-full flex-col bg-transparent md:flex-row overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="flex w-full flex-none flex-col overflow-y-auto border-b border-[var(--border-color-light)] bg-[var(--surface-2)] dark:border-white/[0.09] p-6 md:w-[280px] md:border-b-0 md:border-r md:border-[var(--border-color-light)] dark:md:border-white/[0.09]">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview & Details</h4>
            <div className="flex flex-col gap-1">
              {activeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all text-left w-full",
                      isActive 
                        ? "bg-primary/10 font-semibold text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0 overflow-y-auto p-6 md:p-8 flex flex-col gap-8" onScroll={handleScroll}>
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} id={`persona-${item.id}`} className="scroll-mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-2)] border-[var(--border-color-light)] dark:border-white/[0.09] shadow-sm">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">{item.label}</h2>
                  </div>
                  <div className="rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-2)] p-5 shadow-sm text-[15px] leading-relaxed text-muted-foreground dark:border-white/[0.09]">
                    <p className="whitespace-pre-wrap">{persona?.[item.key as keyof Persona] as string}</p>
                    {item.id === "summary" && attributes.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {attributes.map((attr, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
