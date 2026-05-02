"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import {
  authCardClassName,
  authCardHeaderClassName,
  authCardHeaderLineClassName,
  authCardInnerClassName,
  authCardSubtitleClassName,
  authCardTitleClassName,
  authCheckboxRowClassName,
  authFormErrorBoxClassName,
  authLabelClassName,
  authPasswordStrengthBlockClassName,
  authSignInLinkClassName,
  authSignInTextClassName,
  authSubmitButtonClassName,
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
import { AuthPasswordField } from "@/app/(auth)/components/AuthPasswordField";
import { AuthWordmark } from "@/app/(auth)/components/AuthWordmark";
import PasswordStrengthBar from "@/app/(auth)/components/PasswordStrengthBar";
import { registerSchema, type RegisterFormValues } from "@/lib/auth/auth-schemas";
import { authApi, parseApiError, parseFieldErrors } from "@/lib/api";
import { useRedirectIfAuthenticatedWithOnboarding } from "@/lib/auth/use-redirect-if-authenticated-with-onboarding";
import { cn } from "@/lib/ui/cn";
import { useAuthStore } from "@/lib/store";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[14px] text-[var(--error-color)]">{message}</p>;
}

type SignupFieldKey = "email" | "password" | "first_name" | "last_name";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Partial<Record<SignupFieldKey, string>>
  >({});
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const setSession = useAuthStore((s) => s.setSession);

  useRedirectIfAuthenticatedWithOnboarding();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      authApi.signup({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        recaptcha_token: values.recaptcha_token,
      }),
    onSuccess: (response) => {
      const user = response.data?.user;
      if (user) {
        setSession(user);
        router.replace("/verify-email");
      } else {
        router.replace("/login");
      }
    },
    onError: (error) => {
      // reCAPTCHA tokens are single-use; force a fresh challenge on any failure.
      recaptchaRef.current?.reset();
      form.setFieldValue("recaptcha_token", "");
      const fieldErrors = parseFieldErrors(error);
      const next: Partial<Record<SignupFieldKey, string>> = {};
      for (const [key, msg] of Object.entries(fieldErrors)) {
        if (key === "email" || key === "password" || key === "first_name" || key === "last_name") {
          next[key as SignupFieldKey] = msg;
        }
      }
      if (Object.keys(next).length) {
        setServerFieldErrors(next);
      } else {
        setFormError(parseApiError(error));
      }
    },
  });

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      terms: false,
      recaptcha_token: "",
    } as RegisterFormValues,
    validators: { onSubmit: registerSchema },
    onSubmit: ({ value }) => {
      setFormError(null);
      setServerFieldErrors({});
      mutate(value);
    },
  });

  return (
    <AuthPageRoot>
      <AuthLeftPanel />

      <AuthRightColumn>
        <AuthRightMain>
          <AuthFormStack>
            <AuthMobileLogoRow>
              <AuthWordmark href="/" />
            </AuthMobileLogoRow>

            <div className={authCardClassName}>
              <div className={authCardInnerClassName}>
                <div className={authCardHeaderClassName}>
                  <div className={authCardHeaderLineClassName} />
                  <h2 className={authCardTitleClassName}>Create your free account</h2>
                  <p className={authCardSubtitleClassName}>
                    Create your profile and start turning interviews into hiring signal.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                  }}
                  className="flex flex-col gap-4"
                >
                  {formError ? (
                    <div className={authFormErrorBoxClassName} role="alert">
                      {formError}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field name="first_name">
                      {(field) => (
                        <div>
                          <label htmlFor="register-first-name" className={authLabelClassName}>
                            First Name
                          </label>
                          <AuthInputField
                            id="register-first-name"
                            autoComplete="given-name"
                            placeholder="Jane"
                            icon={<User className="h-4 w-4" strokeWidth={2} aria-hidden />}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                          <FieldError
                            message={
                              serverFieldErrors.first_name ??
                              field.state.meta.errors[0]?.message
                            }
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="last_name">
                      {(field) => (
                        <div>
                          <label htmlFor="register-last-name" className={authLabelClassName}>
                            Last Name
                          </label>
                          <AuthInputField
                            id="register-last-name"
                            autoComplete="family-name"
                            placeholder="Doe"
                            icon={<User className="h-4 w-4" strokeWidth={2} aria-hidden />}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                          <FieldError
                            message={
                              serverFieldErrors.last_name ??
                              field.state.meta.errors[0]?.message
                            }
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Field name="email">
                    {(field) => (
                      <div>
                        <label htmlFor="register-email" className={authLabelClassName}>
                          Email
                        </label>
                        <AuthInputField
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          placeholder="jane@company.com"
                          icon={<Mail className="h-4 w-4" strokeWidth={2} aria-hidden />}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <FieldError
                          message={
                            serverFieldErrors.email ??
                            field.state.meta.errors[0]?.message
                          }
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="password">
                    {(field) => (
                      <div className={authPasswordStrengthBlockClassName}>
                        <label htmlFor="register-password" className={authLabelClassName}>
                          Password
                        </label>
                        <AuthPasswordField
                          id="register-password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          icon={<Lock className="h-4 w-4" strokeWidth={2} aria-hidden />}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <PasswordStrengthBar password={field.state.value ?? ""} />
                        <FieldError
                          message={
                            serverFieldErrors.password ??
                            field.state.meta.errors[0]?.message
                          }
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="confirm_password">
                    {(field) => (
                      <div>
                        <label htmlFor="register-confirm" className={authLabelClassName}>
                          Confirm Password
                        </label>
                        <AuthPasswordField
                          id="register-confirm"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          icon={<Lock className="h-4 w-4" strokeWidth={2} aria-hidden />}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <FieldError message={field.state.meta.errors[0]?.message} />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="terms">
                    {(field) => (
                      <div className={authCheckboxRowClassName}>
                        <input
                          id="register-terms"
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border border-[var(--border-color)] accent-[var(--primary-color)]"
                          checked={Boolean(field.state.value)}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          onBlur={field.handleBlur}
                        />
                        <div>
                          <label
                            htmlFor="register-terms"
                            className={cn(authLabelClassName, "mb-0 cursor-pointer font-normal")}
                          >
                            I agree to the{" "}
                            <Link href="/terms-of-service" className={authSignInLinkClassName}>
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy-policy" className={authSignInLinkClassName}>
                              Privacy Policy
                            </Link>
                          </label>
                          <FieldError message={field.state.meta.errors[0]?.message} />
                        </div>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="recaptcha_token">
                    {(field) => (
                      <div className="flex flex-col items-center gap-1.5">
                        {RECAPTCHA_SITE_KEY ? (
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(token) => field.handleChange(token ?? "")}
                            onExpired={() => field.handleChange("")}
                            onErrored={() => field.handleChange("")}
                          />
                        ) : null}
                        <FieldError message={field.state.meta.errors[0]?.message} />
                      </div>
                    )}
                  </form.Field>

                  <button type="submit" disabled={isPending} className={authSubmitButtonClassName}>
                    {isPending ? "Creating account…" : "Create Free Account"}
                  </button>
                </form>
              </div>
            </div>

            <p className={authSignInTextClassName}>
              Already have an account?{" "}
              <Link href="/login" className={authSignInLinkClassName}>
                Sign in
              </Link>
            </p>
          </AuthFormStack>
        </AuthRightMain>

        <AuthFooterSlot>
          <AuthFooter />
        </AuthFooterSlot>
      </AuthRightColumn>
    </AuthPageRoot>
  );
}
