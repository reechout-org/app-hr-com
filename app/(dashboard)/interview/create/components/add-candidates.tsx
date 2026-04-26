"use client";

import { useState } from "react";
import { Users, Plus, Upload, User as UserIcon, Edit2, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CandidateForm {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface AddCandidatesProps {
  candidates: CandidateForm[];
  onChange: (candidates: CandidateForm[]) => void;
}

export function AddCandidates({ candidates, onChange }: AddCandidatesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<CandidateForm>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const handleOpenAdd = () => {
    setFormData({ id: "", first_name: "", last_name: "", email: "", phone: "" });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (candidate: CandidateForm) => {
    setFormData({ ...candidate });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email) return;

    if (isEditMode) {
      onChange(candidates.map(c => c.id === formData.id ? formData : c));
    } else {
      onChange([...candidates, { ...formData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onChange(candidates.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-8 rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/10 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color-light)] dark:border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-bold">2</div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Add Candidates
              {candidates.length > 0 && (
                <span className="flex items-center justify-center h-5 px-2 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold">
                  {candidates.length}
                </span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">Who will be participating in this interview?</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" className="h-10 rounded-xl" onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
          <Button variant="outline" className="h-10 rounded-xl" onClick={() => setIsBulkModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[var(--surface-2)] rounded-[16px] border border-dashed border-[var(--border-color-light)] dark:border-white/10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--surface-3)] text-muted-foreground mb-4">
              <Users className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-[16px] font-bold text-foreground mb-1">No candidates added yet</h3>
            <p className="text-[13px] text-muted-foreground">Click &quot;Add Candidate&quot; to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {candidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 transition-all hover:border-[var(--primary-color)]/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface-3)] shrink-0">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[15px] text-foreground truncate">
                      {candidate.first_name} {candidate.last_name}
                    </span>
                    <div className="flex items-center gap-3 text-[13px] text-muted-foreground mt-0.5">
                      <span className="truncate">{candidate.email}</span>
                      {candidate.phone && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[var(--border-color-light)] dark:bg-white/20 shrink-0" />
                          <span className="truncate">{candidate.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 rounded-lg"
                    onClick={() => handleOpenEdit(candidate)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-[var(--error-color)] hover:bg-[var(--error-color)]/10 rounded-lg"
                    onClick={() => handleDelete(candidate.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09]">
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl font-bold text-foreground">
                  {isEditMode ? "Edit Candidate" : "Add Candidate"}
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
                    className="rounded-xl h-12 bg-[var(--surface-2)] border-[var(--border-color-light)] dark:border-white/5 px-4 text-[15px]"
                    placeholder="Enter first name"
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
                    className="rounded-xl h-12 bg-[var(--surface-2)] border-[var(--border-color-light)] dark:border-white/5 px-4 text-[15px]"
                    placeholder="Enter last name"
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
                  className="rounded-xl h-12 bg-[var(--surface-2)] border-[var(--border-color-light)] dark:border-white/5 px-4 text-[15px]"
                  placeholder="Enter candidate email"
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
                  className="rounded-xl h-12 bg-[var(--surface-2)] border-[var(--border-color-light)] dark:border-white/5 px-4 text-[15px]"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color-light)] dark:border-white/[0.09] mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 rounded-xl px-6 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 rounded-xl bg-[var(--primary-color)] px-6 font-semibold hover:bg-[var(--primary-color-hover)] text-white"
                >
                  {isEditMode ? "Save Changes" : "Add Candidate"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      {/* Bulk Add Modal */}
      <Dialog open={isBulkModalOpen} onOpenChange={(open) => !open && setIsBulkModalOpen(false)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-[var(--border-color-light)] bg-[var(--background-color)] shadow-[0_24px_48px_rgba(var(--shadow-rgb),0.12)] rounded-[var(--radius-md)] dark:border-white/[0.09]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-6 py-4 dark:border-white/[0.09]">
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Bulk Add Candidates
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="flex flex-col gap-6 p-6 overflow-y-auto">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-foreground mb-1">Upload Candidate File</h4>
                  <p className="text-[13px] text-muted-foreground">Upload a CSV or Excel file containing candidate information.</p>
                </div>
                
                <div className="text-[13px] text-foreground bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border-color-light)] dark:border-white/5">
                  <p className="mb-2"><strong className="text-[var(--primary-color)]">Required columns:</strong> FirstName, LastName, Email, Phone</p>
                  <p className="mb-1 font-semibold">CSV Example:</p>
                  <pre className="text-[12px] bg-black/5 dark:bg-white/5 p-3 rounded-lg overflow-x-auto text-muted-foreground border border-black/5 dark:border-white/5">
{`FirstName,LastName,Email,Phone
John,Doe,john.doe@example.com,+1234567890
Jane,Smith,jane.smith@example.com,+9876543210`}
                  </pre>
                  <p className="text-[11px] text-muted-foreground mt-3 italic">
                    Note: Accepted file formats: .csv, .xlsx, .xls (Max size: 5MB)
                  </p>
                </div>

                <div className="mt-2 relative">
                  {!selectedFile ? (
                    <>
                      <input 
                        type="file" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="border-2 border-dashed border-[var(--border-color-light)] dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] transition-colors relative z-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground">Click or drag file to this area to upload</p>
                          <p className="text-xs text-muted-foreground mt-1">Support for a single or bulk upload.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-foreground truncate max-w-[300px]">
                            {selectedFile.name}
                          </span>
                          <span className="text-[12px] text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-[var(--error-color)] hover:bg-[var(--error-color)]/10 rounded-lg"
                        onClick={() => setSelectedFile(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color-light)] dark:border-white/[0.09] mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="h-10 rounded-xl px-6 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="h-10 rounded-xl bg-[var(--primary-color)] px-6 font-semibold hover:bg-[var(--primary-color-hover)] text-white"
                  onClick={() => {
                    toast.error("Not Implemented", { description: "Bulk CSV parsing requires backend API support in this phase." });
                  }}
                >
                  Add Candidates
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
