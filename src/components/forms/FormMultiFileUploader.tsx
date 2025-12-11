"use client";

import { useState, useCallback } from "react";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Controller, Control, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type FormMultiFileUploaderProps = {
  name: string;
  control: Control<any>;
  maxSizeMB?: number;
  maxFiles?: number;
  initialFiles?: {
    name: string;
    size: number;
    type: string;
    url: string;
    id: string;
  }[];
};

export default function FormMultiFileUploader({
  name,
  control,
  maxSizeMB = 5,
  maxFiles = 6,
  initialFiles = [],
}: FormMultiFileUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024;
  const [files, setFiles] = useState<any[]>(initialFiles);

  const [
    { isDragging, errors },
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
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
    initialFiles,
  });

  // Watch the value of the file field from react-hook-form
  const watchedFiles = useWatch({ control, name });

  const handleFileAdd = useCallback(() => {
    openFileDialog();
  }, [openFileDialog]);

  const handleFileRemove = useCallback(
    (fileId: string) => {
      removeFile(fileId);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    },
    [removeFile]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          {/* Drop area */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            data-files={files.length > 0 || undefined}
            className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
            />

            {files.length > 0 ? (
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">
                    Uploaded Files ({files.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFileAdd}
                    disabled={files.length >= maxFiles}
                  >
                    <UploadIcon className="-ms-0.5 size-3.5 opacity-60" />
                    Add more
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-accent relative aspect-square rounded-md"
                    >
                      <Image
                        src={file.preview || ""}
                        alt={file.file.name}
                        layout="fill"
                        objectFit="cover"
                        className="size-full"
                      />
                      <Button
                        onClick={() => handleFileRemove(file.id)}
                        size="icon"
                        className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                        aria-label="Remove image"
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">
                  Drop your images here
                </p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleFileAdd}
                >
                  <UploadIcon className="-ms-1 opacity-60" />
                  Select images
                </Button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}

          {/* Log watched files */}
          <div className="mt-4">
            <h4 className="text-sm font-medium">Watched Files:</h4>
            <pre>{JSON.stringify(watchedFiles, null, 2)}</pre>
          </div>
        </div>
      )}
    />
  );
}
