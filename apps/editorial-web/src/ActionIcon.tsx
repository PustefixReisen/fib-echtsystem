import type { ReactNode } from "react";
function IconGlyph({name}:{name:string}) {
  const paths:Record<string,string>={
    "→":"M4 12h16m-6-6 6 6-6 6",
    "↗":"M5 19 19 5M6 5h13v13",
    "🗑":"M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
    "▤":"M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 11h8m-8 4h8m-8 4h6",
    "✎":"m4 16-1 5 5-1L21 7l-4-4L4 16Zm11-11 4 4",
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg>;
}
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
      className={children === "→" ? "fib-action-icon fib-navigation-icon" : "fib-action-icon"}
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {typeof children === "string" && ["→","🗑","▤","✎"].includes(children) ? <IconGlyph name={children}/> : children}
    </button>
  );
}
export function OriginalLink(
  { url, label = "Original im RIS öffnen", text }: {
    url?: string | null;
    label?: string;
    text: ReactNode;
  },
) {
  if (!url || !/^https:\/\//i.test(url)) return <span>{text}</span>;
  return (
    <a className="ris-external-reference"
      href={url} target="_blank" rel="noopener noreferrer"
      title={label}>
      <IconGlyph name="↗"/>
      <span>{text}</span>
    </a>
  );
}
