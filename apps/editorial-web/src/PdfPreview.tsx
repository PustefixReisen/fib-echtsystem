import { useEffect, useRef, useState } from "react";
import { type SourceApi, sourceApi } from "./source-api.js";

/** Browser PDF viewer: bytes come exclusively from the authorized FIB endpoint. */
export function PdfPreview(
  { versionId, title, onClose, api = sourceApi }: {
    versionId: string;
    title: string;
    onClose: () => void;
    api?: SourceApi;
  },
) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    let active = true, objectUrl = "";
    void api({ action: "source_pdf", versionId }).then((result) => {
      if (!active) return;
      if (!(result.pdf instanceof Blob)) {
        throw Error("Gespeicherte PDF-Datei nicht verfügbar.");
      }
      objectUrl = URL.createObjectURL(result.pdf);
      setUrl(objectUrl);
    }).catch((e) => {
      if (active) {
        setError(
          e instanceof Error ? e.message : "PDF konnte nicht geladen werden.",
        );
      }
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      previous?.focus();
    };
  }, [versionId, api]);
  return (
    <dialog
      ref={dialog}
      className="fib-pdf-dialog"
      aria-labelledby="pdf-preview-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="section-heading">
        <h2 id="pdf-preview-title">{title}</h2>
        <button type="button" autoFocus onClick={onClose}>Schließen</button>
      </div>
      {error && <p role="alert">{error}</p>}
      {!error && !url && (
        <p role="status">Gespeichertes Original wird geladen …</p>
      )}
      {url && <iframe title="Gespeichertes Original-PDF" src={url} />}
      <p>
        Die PDF-Werkzeugleiste bietet Blättern, Zoom und Drucken. Text kann im
        Dokument markiert und kopiert werden.
      </p>
    </dialog>
  );
}
