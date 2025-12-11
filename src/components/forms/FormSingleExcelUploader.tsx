"use client";

import { useState, useEffect } from "react";
import { AlertCircleIcon, FileSpreadsheetIcon, XIcon } from "lucide-react";
import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";
import { Controller, Control, UseFormSetValue } from "react-hook-form";

type FormSingleFileUploaderProps = {
  name: string;
  control: Control<any>;
  maxSizeMB?: number;
  setValue: UseFormSetValue<any>;
};

export default function FormSingleExcelUploader({
  name,
  control,
  maxSizeMB = 5,
  setValue,
}: FormSingleFileUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024;

  // Store the actual File object
  const [selectedFile, setSelectedFile] = useState<File | FileMetadata | null>(null);

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
    accept:
      ".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxSize,
  });

  // Sync selectedFile state whenever files change
  useEffect(() => {
    if (files.length > 0 && files[0]?.file !== selectedFile) {
      console.log('file', files[0].file)
      setSelectedFile(files[0].file);
      setValue(name,files[0].file )
    } else if (files.length === 0) {
      setSelectedFile(null);
    }
  }, [files, selectedFile]);

  // Remove file
  const handleFileRemove = () => {
    if (files[0]?.id) removeFile(files[0].id);
    setSelectedFile(null);
  };

  console.log({selectedFile})

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {

        // Sync form field with selectedFile
        // useEffect(() => {
        //   field.onChange(selectedFile);
        // }, [selectedFile, field]);


        return (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <div
                role="button"
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors"
              >
                <input {...getInputProps()} className="sr-only" aria-label="Upload Excel file" />

                {selectedFile ?

                  (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                      <FileSpreadsheetIcon className="size-10 text-green-600 mb-2" />
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )

                  : (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                      <FileSpreadsheetIcon className="size-8 opacity-60 mb-2" />
                      <p className="mb-1.5 text-sm font-medium">
                        Drop your Excel file here or click to browse
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Allowed: .xls, .xlsx, .csv | Max size: {maxSizeMB}MB
                      </p>
                    </div>
                  )}
              </div>

              {selectedFile && (
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                    onClick={handleFileRemove}
                    aria-label="Remove file"
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {errors.length > 0 && (
              <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                <AlertCircleIcon className="size-3 shrink-0" />
                <span>{errors[0]}</span>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
