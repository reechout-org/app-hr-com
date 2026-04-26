"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Save } from "lucide-react";

import { interviewsApi } from "@/lib/api/interviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
}

export function AddCandidateModal({
  isOpen,
  onClose,
  interviewId,
}: AddCandidateModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    schedule_date: "",
  });

  const addMutation = useMutation({
    mutationFn: () =>
      interviewsApi.addCandidateToInterview({
        interview_id: interviewId,
        ...formData,
      }),
    onSuccess: () => {
      toast.success("Candidate Added", {
        description: "Candidate has been successfully added to the interview.",
      });
      queryClient.invalidateQueries({ queryKey: ["interviews", interviewId] });
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        schedule_date: "",
      });
      onClose();
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to add candidate. Please check your inputs and try again.",
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields (First Name, Last Name, Email).",
      });
      return;
    }
    addMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09]">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-xl font-bold text-foreground">
                Add Candidate
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first_name" className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                  First Name *
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="rounded-xl"
                  placeholder="John"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last_name" className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Name *
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="rounded-xl"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Note: schedule_date is optional in the interface, we'll omit the visual field to keep it simple, or add a simple datetime-local input */}
            
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color-light)] dark:border-white/[0.09] mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-10 rounded-xl px-6 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-xl bg-[var(--primary-color)] px-6 font-semibold hover:bg-[var(--primary-color-hover)]"
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Candidate
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
