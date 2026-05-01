"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { authApi, parseApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth.store";
import { cn } from "@/lib/ui/cn";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function getInitials(firstName: string, lastName: string): string {
  const first = (firstName || "").trim().charAt(0);
  const last = (lastName || "").trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}

type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  tone: "muted" | "weak" | "fair" | "good" | "strong";
};

function scorePassword(pwd: string): PasswordStrength {
  if (!pwd) return { score: 0, label: "—", tone: "muted" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
  const bounded = Math.max(0, Math.min(4, score)) as 0 | 1 | 2 | 3 | 4;
  const label = ["Too short", "Weak", "Fair", "Good", "Strong"][bounded];
  const tone = (["weak", "weak", "fair", "good", "strong"] as const)[bounded];
  return { score: bounded, label, tone };
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url ?? null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wasOpen, setWasOpen] = useState(isOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset form state each time the modal is re-opened, without an effect.
  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setFirstName(user?.first_name ?? "");
    setLastName(user?.last_name ?? "");
    setAvatarPreview(user?.avatar_url ?? null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      authApi.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }),
    onSuccess: (res) => {
      if (res?.data) setUser(res.data);
      toast.success("Profile updated", {
        description: "Your name has been saved.",
      });
    },
    onError: (error) => {
      toast.error("Couldn't update profile", {
        description: parseApiError(error),
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: (res) => {
      if (res?.data) {
        setUser(res.data);
        setAvatarPreview(res.data.avatar_url);
      }
      toast.success("Photo updated", {
        description: "Your profile picture has been saved.",
      });
    },
    onError: (error) => {
      toast.error("Couldn't upload photo", {
        description: parseApiError(error),
      });
      setAvatarPreview(user?.avatar_url ?? null);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed", {
        description: "For your security, other sessions have been signed out.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error("Couldn't change password", {
        description: parseApiError(error),
      });
    },
  });

  const processFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported image", {
        description: "Please choose a PNG, JPEG, or WebP image.",
      });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large", {
        description: "Maximum size is 5 MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (typeof evt.target?.result === "string") {
        setAvatarPreview(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
    uploadAvatarMutation.mutate(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Name required", {
        description: "First and last name can't be empty.",
      });
      return;
    }
    updateProfileMutation.mutate();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Missing fields", {
        description: "Fill in every password field.",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password too short", {
        description: "New password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must match.",
      });
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("Choose a different password", {
        description: "New password must differ from your current password.",
      });
      return;
    }
    changePasswordMutation.mutate();
  };

  const strength = useMemo(() => scorePassword(newPassword), [newPassword]);
  const confirmMatches = confirmPassword.length > 0 && confirmPassword === newPassword;
  const passwordFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmMatches &&
    newPassword !== currentPassword;

  const profileDirty =
    firstName.trim() !== (user?.first_name ?? "") ||
    lastName.trim() !== (user?.last_name ?? "");

  const initials = getInitials(
    firstName || user?.first_name || "",
    lastName || user?.last_name || "",
  );
  const isUploadingAvatar = uploadAvatarMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-[920px] p-0 overflow-hidden rounded-[var(--radius-lg)] border-[var(--border-color-light)] bg-[var(--background-color)]",
          "shadow-[0_32px_80px_-20px_rgba(var(--shadow-rgb),0.35),0_8px_20px_-10px_rgba(var(--shadow-rgb),0.18)]",
          "dark:border-white/[0.09]",
        )}
      >
        <div className="flex max-h-[90vh] flex-col">
          {/* Hero header with avatar */}
          <div
            className={cn(
              "relative overflow-hidden border-b border-[var(--border-color-light)] px-10 pt-9 pb-7 dark:border-white/[0.09]",
              "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary-color)_12%,var(--surface-2))_0%,var(--surface-2)_70%)]",
            )}
          >
            <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[var(--primary-color)]/15 blur-3xl" />
            <DialogHeader className="relative p-0 text-left">
              <DialogTitle className="text-[24px] font-bold tracking-tight text-foreground">
                Account settings
              </DialogTitle>
              <p className="text-[14px] text-[var(--text-secondary)]">
                Update your personal information and keep your account secure.
              </p>
            </DialogHeader>

            <div className="relative mt-7 flex items-center gap-6">
              {/* Avatar with camera badge */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "relative h-28 w-28 shrink-0 rounded-full transition-all",
                  isDragging &&
                    "ring-4 ring-[var(--primary-color)]/40 ring-offset-2 ring-offset-transparent scale-[1.02]",
                )}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile photo"
                  disabled={isUploadingAvatar}
                  className={cn(
                    "group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 text-[28px] font-bold outline-none transition-all",
                    "border-white shadow-[0_8px_24px_-8px_rgba(var(--shadow-rgb),0.35)] dark:border-white/10",
                    "focus-visible:ring-4 focus-visible:ring-[var(--primary-color)]/30",
                  )}
                >
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--primary-color)_0%,color-mix(in_oklab,var(--primary-color)_70%,#000)_100%)] text-white">
                      {initials || <UserIcon className="h-9 w-9" strokeWidth={1.75} />}
                    </div>
                  )}
                </button>

                {/* Camera badge (bottom-right) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload a new profile photo"
                  disabled={isUploadingAvatar}
                  className={cn(
                    "absolute right-0 bottom-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[var(--primary-color)] text-white shadow-[0_4px_12px_-2px_rgba(var(--shadow-rgb),0.4)] outline-none transition-all",
                    "hover:bg-[var(--primary-color-hover,var(--primary-color))] hover:scale-105",
                    "focus-visible:ring-4 focus-visible:ring-[var(--primary-color)]/30",
                    "disabled:cursor-not-allowed disabled:opacity-80",
                    "dark:border-[var(--surface-2)]",
                  )}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
                  ) : (
                    <Camera className="h-4 w-4" strokeWidth={2.25} />
                  )}
                </button>
              </div>

              {/* Identity block */}
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="truncate text-[20px] font-semibold text-foreground">
                  {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                    "Your name"}
                </h2>
                <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{user?.email ?? ""}</span>
                </div>
                {avatarPreview && (
                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(null);
                        toast.message("Photo removed locally", {
                          description: "Upload a new one to replace it.",
                        });
                      }}
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--error-color)]"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove photo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Single scrolling body — both sections at once */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-8 px-10 py-8 lg:grid-cols-2">
              {/* Personal information */}
              <section aria-labelledby="profile-section-heading">
                <form
                  onSubmit={handleSaveProfile}
                  className="flex h-full flex-col gap-6"
                >
                  <SectionHeader
                    id="profile-section-heading"
                    icon={<UserIcon className="h-4 w-4" />}
                    title="Personal information"
                    description="What candidates and teammates see across ReechOut."
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FieldGroup
                      id="profile_first_name"
                      label="First Name"
                      required
                    >
                      <Input
                        id="profile_first_name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 rounded-xl"
                        placeholder="Jane"
                        required
                        autoComplete="given-name"
                      />
                    </FieldGroup>
                    <FieldGroup
                      id="profile_last_name"
                      label="Last Name"
                      required
                    >
                      <Input
                        id="profile_last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-11 rounded-xl"
                        placeholder="Doe"
                        required
                        autoComplete="family-name"
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup
                    id="profile_email"
                    label="Email"
                    hint="Contact support to change the email on file."
                  >
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                      <Input
                        id="profile_email"
                        value={user?.email ?? ""}
                        disabled
                        className="h-11 rounded-xl bg-[var(--surface-2)] pl-9"
                      />
                    </div>
                  </FieldGroup>

                  <div className="mt-auto flex items-center justify-between border-t border-[var(--border-color-light)] pt-5 dark:border-white/[0.09]">
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {profileDirty
                        ? "You have unsaved changes"
                        : "Everything is up to date"}
                    </p>
                    <Button
                      type="submit"
                      className="h-10 rounded-xl bg-[var(--primary-color)] px-5 font-semibold hover:bg-[var(--primary-color-hover)]"
                      disabled={updateProfileMutation.isPending || !profileDirty}
                    >
                      {updateProfileMutation.isPending ? (
                        "Saving…"
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </section>

              {/* Vertical divider on large screens, horizontal on small */}
              <div className="hidden lg:block lg:w-px lg:self-stretch lg:bg-[var(--border-color-light)] lg:absolute" />

              {/* Security section */}
              <section
                aria-labelledby="security-section-heading"
                className="relative lg:pl-8 lg:border-l lg:border-[var(--border-color-light)] lg:dark:border-white/[0.09]"
              >
                <form
                  onSubmit={handleChangePassword}
                  className="flex h-full flex-col gap-6"
                >
                  <SectionHeader
                    id="security-section-heading"
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Reset password"
                    description="Choose a strong new password. Other sessions will be signed out."
                  />

                  <FieldGroup
                    id="current_password"
                    label="Current Password"
                    required
                  >
                    <PasswordField
                      id="current_password"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      visible={showCurrentPassword}
                      onToggleVisibility={() => setShowCurrentPassword((v) => !v)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </FieldGroup>

                  <FieldGroup
                    id="new_password"
                    label="New Password"
                    required
                  >
                    <PasswordField
                      id="new_password"
                      value={newPassword}
                      onChange={setNewPassword}
                      visible={showNewPassword}
                      onToggleVisibility={() => setShowNewPassword((v) => !v)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                    <PasswordMeter
                      strength={strength}
                      hasValue={newPassword.length > 0}
                    />
                  </FieldGroup>

                  <FieldGroup
                    id="confirm_password"
                    label="Confirm New Password"
                    required
                  >
                    <PasswordField
                      id="confirm_password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      visible={showConfirmPassword}
                      onToggleVisibility={() => setShowConfirmPassword((v) => !v)}
                      placeholder="Retype new password"
                      autoComplete="new-password"
                      inputClassName={cn(
                        confirmMatches && "border-[var(--success-color)]/60",
                      )}
                      rightAdornment={
                        confirmMatches ? (
                          <Check className="h-4 w-4 text-[var(--success-color)]" />
                        ) : null
                      }
                    />
                  </FieldGroup>

                  <div className="mt-auto flex items-center justify-between border-t border-[var(--border-color-light)] pt-5 dark:border-white/[0.09]">
                    <p className="text-[12px] text-[var(--text-muted)]">
                      Minimum 8 characters.
                    </p>
                    <Button
                      type="submit"
                      className="h-10 rounded-xl bg-[var(--primary-color)] px-5 font-semibold hover:bg-[var(--primary-color-hover)]"
                      disabled={
                        changePasswordMutation.isPending || !passwordFormValid
                      }
                    >
                      {changePasswordMutation.isPending ? (
                        "Updating…"
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Update password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeader({
  id,
  icon,
  title,
  description,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 id={id} className="text-[15px] font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-[13px] text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

function FieldGroup({
  id,
  label,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--primary-color)]">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[11.5px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

function PasswordField({
  id,
  value,
  onChange,
  visible,
  onToggleVisibility,
  placeholder,
  autoComplete,
  inputClassName,
  rightAdornment,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
  placeholder?: string;
  autoComplete?: string;
  inputClassName?: string;
  rightAdornment?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 rounded-xl pr-20",
          inputClassName,
        )}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
        {rightAdornment ? <div className="pointer-events-none">{rightAdornment}</div> : null}
        <button
          type="button"
          tabIndex={-1}
          onClick={onToggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded text-[var(--text-secondary)] transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]/40"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function PasswordMeter({
  strength,
  hasValue,
}: {
  strength: PasswordStrength;
  hasValue: boolean;
}) {
  const toneClass: Record<PasswordStrength["tone"], string> = {
    muted: "bg-[var(--border-color-light)]",
    weak: "bg-[var(--error-color)]",
    fair: "bg-[var(--warning-color,#faad14)]",
    good: "bg-[var(--primary-color)]",
    strong: "bg-[var(--success-color)]",
  };
  const toneTextClass: Record<PasswordStrength["tone"], string> = {
    muted: "text-[var(--text-muted)]",
    weak: "text-[var(--error-color)]",
    fair: "text-[color:var(--warning-color,#b45309)]",
    good: "text-[var(--primary-color)]",
    strong: "text-[var(--success-color)]",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-1.5 flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-full flex-1 rounded-full transition-colors",
              i < strength.score
                ? toneClass[strength.tone]
                : "bg-[var(--border-color-light)] dark:bg-white/10",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "min-w-[48px] text-right text-[11px] font-medium tabular-nums",
          hasValue ? toneTextClass[strength.tone] : "text-[var(--text-muted)]",
        )}
      >
        {hasValue ? strength.label : "—"}
      </span>
    </div>
  );
}
