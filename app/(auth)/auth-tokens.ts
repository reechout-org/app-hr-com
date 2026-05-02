import { cn } from "@/lib/ui/cn";

/** Shared `<input>` styles for auth forms (replaces auth-form-layout `.input`). */
export function authInputClassName(opts?: {
  withLeadingIcon?: boolean;
  /** Right padding for password visibility toggle (`AuthPasswordField`). */
  withPasswordToggle?: boolean;
  extra?: string;
}) {
  const { withLeadingIcon, withPasswordToggle, extra } = opts ?? {};
  return cn(
    "h-[clamp(42px,5.2vh,46px)] w-full rounded-[10px] px-3.5 text-[15px] text-[var(--text-heading)]",
    "bg-[color-mix(in_srgb,var(--foreground)_3%,transparent)] backdrop-blur-sm",
    "border border-[color-mix(in_srgb,var(--foreground)_8%,transparent)]",
    "transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "placeholder:text-[var(--text-muted)] placeholder:opacity-[0.75]",
    "hover:border-[color-mix(in_srgb,var(--primary-color)_30%,var(--foreground)_12%)] hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]",
    "focus:border-[var(--primary-color)] focus:bg-[var(--bg-card)] focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary-color)_12%,transparent),0_2px_8px_rgba(0,0,0,0.04)] focus:-translate-y-[1px]",
    withLeadingIcon && "pl-[42px]",
    withPasswordToggle && "pr-11",
    extra,
  );
}

export const authPasswordToggleButtonClassName = cn(
  "absolute right-1.5 top-1/2 z-[1] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg",
  "text-[var(--text-muted)] transition-colors",
  "hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:text-[var(--text-heading)]",
);

export const authInputIconWrapClassName =
  "pointer-events-none absolute left-3.5 top-1/2 z-[1] flex -translate-y-1/2 items-center justify-center text-[var(--text-muted)] transition-colors duration-300 group-focus-within:text-[var(--primary-color)]";

export const authCardHeaderClassName = "mb-7 text-center max-md:mb-5";

export const authCardHeaderLineClassName =
  "mx-auto mb-4 h-[3px] w-10 rounded-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[rgba(var(--color-primary-rgb),0.15)] shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.45)]";

/** Small label above the card title (onboarding: Security, Profile, Review) */
export const authCardEyebrowClassName =
  "mb-1 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]";

/** Row under password field — spaced below input / field error. */
export const authForgotRowClassName = "mt-4 flex justify-end";

export const authPasswordStrengthBlockClassName = "mb-1";

export const authCheckboxRowClassName = "flex flex-row items-start gap-2.5";

export const authStateStackClassName =
  "flex flex-col items-center gap-4 text-center";

export const authStateIconWrapSuccessClassName = cn(
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border",
  "border-[color-mix(in_srgb,var(--color-success)_25%,transparent)]",
  "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]",
);

export const authStateIconWrapErrorClassName = cn(
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border",
  "border-[color-mix(in_srgb,var(--destructive)_25%,transparent)]",
  "bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)]",
);

export const authStateIconSuccessClassName = "text-[var(--color-success)]";
export const authStateIconErrorClassName = "text-[var(--destructive)]";

export const authTitleFlushClassName = "mb-0";

export const authSuspenseFallbackClassName = "flex items-center justify-center p-12";

export const authLinkPlainClassName =
  "cursor-pointer border-0 bg-transparent p-0 text-[14px] text-[var(--text-muted)]";

export const authSubmitButtonClassName = cn(
  "relative w-full cursor-pointer overflow-hidden rounded-[10px] border border-white/10 font-bold tracking-wide text-white text-[15px]",
  "h-[clamp(42px,5.2vh,46px)] shadow-[0_4px_14px_rgba(var(--primary-color-rgb),0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
  "bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-hover)]",
  "transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
  "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.12] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
  "hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(var(--primary-color-rgb),0.45),inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary-hover)]",
  "active:scale-[0.98] active:translate-y-0 active:shadow-[0_2px_8px_rgba(var(--primary-color-rgb),0.25)]",
  "disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0 disabled:hover:scale-100",
);

export const authLabelClassName =
  "mb-2 block text-[14px] font-medium text-[var(--text-body)]";

export const authCardClassName = cn(
  "relative overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--foreground)_6%,transparent)]",
  "bg-[linear-gradient(160deg,color-mix(in_srgb,var(--bg-card)_90%,transparent)_0%,var(--bg-card)_100%)]",
  "shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(var(--color-primary-rgb),0.03),0_8px_40px_rgba(var(--color-primary-rgb),0.04)]",
  "backdrop-blur-[16px] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(var(--color-primary-rgb),0.05),0_8px_40px_rgba(var(--color-primary-rgb),0.08)]",
);

export const authCardInnerClassName = "relative z-10 px-[clamp(20px,4vw,40px)] py-[clamp(20px,4vh,40px)]";

export const authCardTitleClassName =
  "mb-2 text-center text-[1.65rem] font-extrabold tracking-[-0.02em] text-[var(--text-heading)]";

export const authCardSubtitleClassName =
  "m-0 text-center text-[15px] leading-[1.5] text-[var(--text-muted)]";

export const authSignInTextClassName =
  "block text-center text-[14px] text-[var(--text-muted)]";

export const authSignInLinkClassName =
  "ml-1 font-semibold text-[var(--color-primary)] no-underline transition-colors hover:text-[var(--color-primary-hover)]";

export const authForgotLinkClassName =
  "text-[14px] font-medium text-[var(--color-primary)] no-underline transition-colors hover:text-[var(--color-primary-hover)]";

export const authBackLinkClassName =
  "inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-primary)] no-underline transition-colors hover:text-[var(--color-primary-hover)]";

export const authFormErrorBoxClassName = cn(
  "rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-[var(--destructive)]",
  "border-[color-mix(in_srgb,var(--destructive)_20%,transparent)]",
  "bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)]",
);
