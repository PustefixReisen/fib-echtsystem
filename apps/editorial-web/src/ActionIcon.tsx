import type { ReactNode } from "react";
export function ActionIcon(
  { label, children, onClick, disabled = false }: {
    label: string;
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  },
) {
  return (
    <button
      type="button"
      className="fib-action-icon"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function OriginalLink(
  { url, label = "Original im RIS öffnen" }: {
    url?: string | null;
    label?: string;
  },
) {
  return url && /^https:\/\//i.test(url)
    ? (
      <a
        className="fib-action-icon"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={label}
        aria-label={label}
      >
        ↗
      </a>
    )
    : null;
}
