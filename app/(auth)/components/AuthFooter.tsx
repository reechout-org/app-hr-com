export default function AuthFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 text-center">
      <span className="text-[13px] leading-4 text-[var(--text-muted)]">
        © {currentYear} ReechOut
      </span>
    </div>
  );
}
