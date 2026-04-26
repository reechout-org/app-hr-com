"use client";

function getPasswordStrength(password: string) {
  if (!password) return { level: 0, label: "", color: "var(--border)" };

  const criteria = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const met = criteria.filter(Boolean).length;

  if (met <= 1) return { level: 1, label: "Weak", color: "var(--color-error)" };
  if (met === 2) return { level: 2, label: "Fair", color: "var(--color-warning)" };
  if (met === 3) return { level: 3, label: "Good", color: "var(--color-primary)" };
  return { level: 4, label: "Strong", color: "var(--color-success)" };
}

export default function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);

  return (
    <div className="mt-1.5 flex items-center gap-3">
      <div className="flex min-w-0 flex-1 gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className="h-1.5 min-w-0 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: bar <= strength.level ? strength.color : "var(--border)",
            }}
          />
        ))}
      </div>
      {password ? (
        <span
          className="whitespace-nowrap text-[13px] font-medium"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      ) : null}
    </div>
  );
}
