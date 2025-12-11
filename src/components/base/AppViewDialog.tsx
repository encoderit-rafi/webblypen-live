import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
type AppDialogProps = {
  title: string;
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
};
export default function AppViewDialog({
  title,
  open,
  onOpenChange,
  children,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="outline-0 flex flex-col gap-0 p-0 sm:max-h-[min(700px,80vh)] md:max-h-[min(750px,80vh)] lg:max-h-[min(800px,80vh)] sm:max-w-xl md:max-w-3xl lg:max-w-5xl [&>button:last-child]:top-3.5"
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="px-6 py-4 text-base">{title}</DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">{children}</div>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
