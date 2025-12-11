import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
type AppDialogProps = {
  title: string;
  buttonText: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: () => void;
  onClickConfirm: () => void;
  children: React.ReactNode;
};
export default function AppDialog({
  title,
  buttonText,
  open,
  isPending,
  onOpenChange,
  onClickConfirm,
  children,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="outline-0 flex flex-col gap-0 p-0 sm:max-h-[min(700px,80vh)] md:max-h-[min(750px,80vh)] lg:max-h-[min(800px,80vh)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl [&>button:last-child]:top-3.5"
      >
        <form onSubmit={onClickConfirm} className="contents">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b px-6 py-4 text-base">
              {title}
            </DialogTitle>
            <div className="overflow-y-auto">
              <DialogDescription asChild>
                <div className="px-6 py-4">{children}</div>
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="border-t px-6 py-4 sm:items-center">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="min-w-24"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="capitalize min-w-24"
              loading={isPending}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
