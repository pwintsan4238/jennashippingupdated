"use client";

import { useEffect, useId, useState } from "react";

const MAX_BYTES = 5 * 1024 * 1024;
const OUT_W = 600;
const OUT_H = 800; // 3:4 passport ratio

/** Center-crops an image to 3:4 and re-encodes as JPEG. */
async function cropToPassport(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const targetRatio = OUT_W / OUT_H;
  const srcRatio = bitmap.width / bitmap.height;
  let sw = bitmap.width;
  let sh = bitmap.height;
  if (srcRatio > targetRatio) sw = sh * targetRatio;
  else sh = sw / targetRatio;
  const sx = (bitmap.width - sw) / 2;
  const sy = Math.max(0, (bitmap.height - sh) / 3); // bias upward to keep the face

  const canvas = document.createElement("canvas");
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  canvas.getContext("2d")!.drawImage(bitmap, sx, sy, sw, sh, 0, 0, OUT_W, OUT_H);
  const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej()), "image/jpeg", 0.88));
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

export function PhotoUpload({
  file,
  onChange,
  error,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
}) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handle = async (f: File | undefined) => {
    setLocalError(null);
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return setLocalError("Use a JPG, PNG or WEBP image.");
    if (f.size > MAX_BYTES * 3) return setLocalError("Image is too large (max 15 MB before resizing).");
    try {
      onChange(await cropToPassport(f));
    } catch {
      setLocalError("This image couldn't be read. Try another photo.");
    }
  };

  const message = localError ?? error;

  return (
    <div>
      <span className="field-label">
        Photo<span className="ml-0.5 text-red-600">*</span>
      </span>
      <label
        htmlFor={id}
        className={`group relative flex aspect-[3/4] w-full max-w-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-white text-center transition hover:border-brand ${
          message ? "border-red-500" : "border-line"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your photo preview" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="px-3 text-sm text-muted">
            <svg aria-hidden viewBox="0 0 24 24" className="mx-auto mb-2 size-8 text-brand" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="9" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
            Upload passport-style photo
            <span className="mt-1 block text-xs">JPG / PNG · auto-cropped 3:4</span>
          </span>
        )}
        {preview && (
          <span className="absolute inset-x-2 bottom-2 rounded-full bg-ink/70 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
            Change photo
          </span>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {message && (
        <p className="field-error" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
