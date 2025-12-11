"use client";

import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { useState, useEffect, use } from "react";
import { getImageSrc } from "@/utils/getImageSrc";
import Image from "next/image";

type FormSingleFileUploaderProps = {
  name: string;
  src: string | null;
  control: Control<any>;
  maxSizeMB?: number;
  setValue: UseFormSetValue<any>;
  isSubmitting: boolean;
};

export default function FormSingleFileUploader({
  name,
  control,
  setValue,
  src,
  maxSizeMB = 5,
  isSubmitting,
}: FormSingleFileUploaderProps) {
  console.log("👉 ~ FormSingleFileUploader ~ src:", src);
  const maxSize = maxSizeMB * 1024 * 1024;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (src && !isSubmitting) {
      setPreviewUrl(getImageSrc(src));
    }
  }, [src]);
  console.log("👉 ~ FormSingleFileUploader ~ previewUrl:", previewUrl);

  // Track image loading & error states
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle file upload with custom hook
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  // Update preview URL when file changes
  useEffect(() => {
    if (files.length > 0) {
      setPreviewUrl(files[0]?.preview ?? null);
      setValue(name, files[0]?.file);
    }
  }, [files]);

  // Reset loading/error when preview changes
  useEffect(() => {
    if (previewUrl) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [previewUrl]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <div className="relative">
            {/* File Upload Box */}
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
            >
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload file"
              />

              {previewUrl ? (
                <div className="absolute inset-0">
                  <div className="relative size-full">
                    {/* Loader */}
                    {!imageLoaded && !imageError && (
                      <div className="flex size-full items-center justify-center bg-muted">
                        <div className="animate-spin rounded-full border-2 border-gray-400 border-t-transparent h-6 w-6" />
                      </div>
                    )}

                    {/* Error Fallback */}
                    {imageError && (
                      <div className="flex size-full flex-col items-center text-rose-500 justify-center bg-muted">
                        <ImageUpIcon className="size-8" />
                        <p className="text-xs  mt-1 ">Failed to load</p>
                        <p className="text-xs font-thin  mt-1 text-muted-foreground">
                          {previewUrl}
                        </p>
                      </div>
                    )}

                    {/* The Image */}
                    {!imageError && (
                      <Image
                        src={previewUrl}
                        alt={previewUrl || "Uploaded image"}
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoadingComplete={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div
                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <ImageUpIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Max size: {maxSizeMB}MB
                  </p>
                </div>
              )}
            </div>

            {/* Remove Button */}
            {previewUrl && (
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                  onClick={() => {
                    removeFile(files[0]?.id);
                    field.onChange(null);
                    setPreviewUrl(null);
                  }}
                  aria-label="Remove image"
                >
                  <XIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Display Errors */}
          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
        </div>
      )}
    />
  );
}
