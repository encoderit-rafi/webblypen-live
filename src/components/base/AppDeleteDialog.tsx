import React from "react";
import { CircleAlertIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
type AppDeleteDialogProps = {
  title?: string;
  description?: string;
  loading: boolean;
  open: boolean;
  onOpenChange: () => void;
  onConfirmDelete: () => void;
};
export default function AppDeleteDialog({
  title = "Are you sure?",
  description = "Are you sure you want to delete? All your data will be removed permanently.",
  loading,
  open,
  onOpenChange,
  onConfirmDelete,
}: AppDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 bg-rose-600/20 border-rose-600/30 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80 text-rose-600" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="min-w-24">
            Cancel
          </AlertDialogCancel>
          <Button
            variant={"destructive"}
            className="min-w-24"
            loading={loading}
            onClick={onConfirmDelete}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
