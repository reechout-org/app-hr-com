"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  authBackLinkClassName,
  authCardClassName,
  authCardHeaderClassName,
  authCardHeaderLineClassName,
  authCardInnerClassName,
  authCardSubtitleClassName,
  authCardTitleClassName,
  authFormErrorBoxClassName,
  authLabelClassName,
  authLinkPlainClassName,
  authSignInTextClassName,
  authStateIconSuccessClassName,
  authStateIconWrapSuccessClassName,
  authStateStackClassName,
  authSubmitButtonClassName,
  authTitleFlushClassName,
} from "@/app/(auth)/auth-tokens";
import AuthFooter from "@/app/(auth)/components/AuthFooter";
import { AuthInputField } from "@/app/(auth)/components/AuthInputField";
import AuthLeftPanel from "@/app/(auth)/components/AuthLeftPanel";
import {
  AuthFooterSlot,
  AuthFormStack,
  AuthMobileLogoRow,
  AuthPageRoot,
  AuthRightColumn,
  AuthRightMain,
} from "@/app/(auth)/components/auth-page-layout";
import { AuthWordmark } from "@/app/(auth)/components/AuthWordmark";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/auth/auth-schemas";
import { authApi, parseApiError } from "@/lib/api";
import { cn } from "@/lib/ui/cn";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[14px] text-[var(--error-color)]">{message}</p>;
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ForgotPasswordFormValues) =>
      authApi.forgotPassword(payload.email),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      setFormError(parseApiError(error));
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setFormError(null);
    mutate(values);
  };

  return (
    <AuthPageRoot>
      <AuthLeftPanel />

      <AuthRightColumn>
        <AuthRightMain>
          <AuthFormStack>
            <AuthMobileLogoRow>
              <AuthWordmark href="/" />
            </AuthMobileLogoRow>

            {submitted ? (
              <div className={authCardClassName}>
                <div className={authCardInnerClassName}>
                  <div className={authStateStackClassName}>
                    <div className={authStateIconWrapSuccessClassName}>
                      <CheckCircle
                        className={authStateIconSuccessClassName}
                        size={26}
                        aria-hidden
                      />
                    </div>
                    <h2 className={cn(authCardTitleClassName, authTitleFlushClassName)}>
                      Check your inbox
                    </h2>
                    <p className={authCardSubtitleClassName}>
                      If an account exists for that email, you&apos;ll receive a password reset link
                      shortly. Check your spam folder if you don&apos;t see it.
                    </p>
                    <Link href="/login" className={authBackLinkClassName}>
                      <ArrowLeft size={14} />
                      Back to sign in
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className={authLinkPlainClassName}
                    >
                      Try a different email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={authCardClassName}>
                <div className={authCardInnerClassName}>
                  <div className={authCardHeaderClassName}>
                    <div className={authCardHeaderLineClassName} />
                    <h2 className={authCardTitleClassName}>Reset your password</h2>
                    <p className={authCardSubtitleClassName}>
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {formError ? (
                      <div className={authFormErrorBoxClassName} role="alert">
                        {formError}
                      </div>
                    ) : null}
                    <div>
                      <label htmlFor="forgot-email" className={authLabelClassName}>
                        Email
                      </label>
                      <AuthInputField
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@company.com"
                        icon={<Mail className="h-4 w-4" strokeWidth={2} aria-hidden />}
                        {...register("email")}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>

                    <button type="submit" disabled={isPending} className={authSubmitButtonClassName}>
                      {isPending ? "Sending…" : "Send Reset Link"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {!submitted ? (
              <p className={authSignInTextClassName}>
                <Link href="/login" className={authBackLinkClassName}>
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              </p>
            ) : null}
          </AuthFormStack>
        </AuthRightMain>

        <AuthFooterSlot>
          <AuthFooter />
        </AuthFooterSlot>
      </AuthRightColumn>
    </AuthPageRoot>
  );
}
