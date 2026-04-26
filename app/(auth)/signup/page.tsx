"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

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
import { splitFullName } from "@/lib/auth/auth-name";
import { authApi, parseApiError, parseFieldErrors } from "@/lib/api";
import { cn } from "@/lib/ui/cn";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[14px] text-[var(--error-color)]">{message}</p>;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      terms: false,
    },
  });

  const password = useWatch({ control, name: "password", defaultValue: "" }) ?? "";

  const { mutate, isPending } = useMutation({
    mutationFn: (values: RegisterFormValues) => {
      const { first_name, last_name } = splitFullName(values.full_name);
      return authApi.signup(first_name, last_name, values.email, values.password);
    },
    onSuccess: () => {
      router.replace("/login");
    },
    onError: (error) => {
      const fieldErrors = parseFieldErrors(error);
      for (const [key, msg] of Object.entries(fieldErrors)) {
        if (key === "email") setError("email", { message: msg });
        if (key === "password") setError("password", { message: msg });
        if (key === "first_name" || key === "full_name") setError("full_name", { message: msg });
      }
      if (!Object.keys(fieldErrors).length) {
        setFormError(parseApiError(error));
      }
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
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

            <div className={authCardClassName}>
              <div className={authCardInnerClassName}>
                <div className={authCardHeaderClassName}>
                  <div className={authCardHeaderLineClassName} />
                  <h2 className={authCardTitleClassName}>Create your free account</h2>
                  <p className={authCardSubtitleClassName}>
                    Create your profile and start turning interviews into hiring signal.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  {formError ? (
                    <div className={authFormErrorBoxClassName} role="alert">
                      {formError}
                    </div>
                  ) : null}
                  <div>
                    <label htmlFor="register-name" className={authLabelClassName}>
                      Full Name
                    </label>
                    <AuthInputField
                      id="register-name"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      icon={<User className="h-4 w-4" strokeWidth={2} aria-hidden />}
                      {...register("full_name")}
                    />
                    <FieldError message={errors.full_name?.message} />
                  </div>

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
                      {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <div className={authPasswordStrengthBlockClassName}>
                    <label htmlFor="register-password" className={authLabelClassName}>
                      Password
                    </label>
                    <AuthPasswordField
                      id="register-password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      icon={<Lock className="h-4 w-4" strokeWidth={2} aria-hidden />}
                      {...register("password")}
                    />
                    <PasswordStrengthBar password={password} />
                    <FieldError message={errors.password?.message} />
                  </div>

                  <div>
                    <label htmlFor="register-confirm" className={authLabelClassName}>
                      Confirm Password
                    </label>
                    <AuthPasswordField
                      id="register-confirm"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      icon={<Lock className="h-4 w-4" strokeWidth={2} aria-hidden />}
                      {...register("confirm_password")}
                    />
                    <FieldError message={errors.confirm_password?.message} />
                  </div>

                  <div className={authCheckboxRowClassName}>
                    <Controller
                      name="terms"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="register-terms"
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border border-[var(--border-color)] accent-[var(--primary-color)]"
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      )}
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
                      <FieldError message={errors.terms?.message} />
                    </div>
                  </div>

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
